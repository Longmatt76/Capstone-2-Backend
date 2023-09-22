"use strict";

const knex = require("../db");
const { NotFoundError } = require("../expressError");

class Order {
  static async create(userId, orderTotal, cart) {
    const parsedCart = JSON.parse(cart);
    const transaction = await knex.transaction();
    console.log("cart:", parsedCart);
    try {
      const [newOrderId] = await transaction("store_order")
        .insert({
          store_id: parsedCart[0].storeId,
          user_id: parseInt(userId),
          order_total: parseInt(orderTotal),
        })
        .returning("id");

      await Promise.all(
        parsedCart.map((cartItem) => {
          return transaction("order_line").insert({
            store_id: cartItem.storeId,
            product_id: cartItem.productId,
            order_id: newOrderId.id,
            price: parseFloat(cartItem.price),
            qty: parseFloat(cartItem.quantity),
          });
        })
      );

      await transaction.commit();

      return newOrderId;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  static async get(orderId) {
    const order = await knex("store_order")
      .select("store_order.*", "user_info.username")
      .where("store_order.id", orderId)
      .leftJoin("user_info", "user_info.id", "store_order.user_id")
      .first();

    if (!order) throw new NotFoundError(`Order ${orderId} not found`);

    const orderLines = await knex("order_line")
      .select("*")
      .where("order_id", orderId);

    const productIds = orderLines.map((line) => line.product_id);

    const products = await knex("product")
      .select("*")
      .whereIn("id", productIds);

    orderLines.forEach((line, index) => {
      line.products = products[index];
    });

    order.orderLines = orderLines.map((line) => ({
      id: line.id,
      store_id: line.store_id,
      product_id: line.product_id,
      price: line.price,
      qty: line.qty,
    }));

    return order;
  }

  static async getAll(storeId) {
    const orders = await knex("store_order")
      .select("*")
      .where("store_id", storeId);

    const orderIds = orders.map((o) => o.id);

    const storeOrders = [];
    for (let orderId of orderIds) {
      const order = await this.get(orderId);
      storeOrders.push(order);
    }
    return storeOrders;
  }
}

module.exports = Order;
