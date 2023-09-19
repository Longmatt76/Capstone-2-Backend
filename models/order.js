"use strict";

const knex = require("../db");

class Order {
  static async create(userId, orderTotal, cart ) {
    const parsedCart = JSON.parse(cart);
    const transaction = await knex.transaction();
    console.log('cart:', parsedCart)
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
}

module.exports = Order;
