"use strict";

const knex = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Store {
  // creates a new store
  static async create(ownerId, { storeName, logo, colorScheme, siteFont }) {
    const duplicateStore = await knex("store")
      .where("store_name", storeName)
      .first();

    if (duplicateStore) {
      throw new BadRequestError(`Store Name:${storeName} already exists`);
    }

    const store = await knex("store")
      .insert({
        owner_id: ownerId,
        store_name: storeName,
        logo,
        color_scheme: colorScheme,
        site_font: siteFont,
      })
      .returning("id AS storeId", "store_name AS storeName");

    return store;
  }


  //  retrieves a single store's info
  static async get(ownerId) {
    const store = await knex("store")
      .select(
        "id AS storeId",
        "owner_id AS ownerId",
        "store_name AS storeName",
        "logo",
        "color_scheme AS colorScheme",
        "site_font AS siteFont"
      )
      .where("owner_id", ownerId)
      .first();

    if (!store) throw new NotFoundError("Store not found");

    const storeId = store.storeId

    const products = await knex("product")
      .select(
        "id AS productId",
        "product_name AS name",
        "product_description AS description",
        "product_img AS image",
        "price",
        "qty_in_stock AS qty"
      )
      .where("store_id", storeId);

    store.products = products.map((p) => ({
      id: p.productId,
      name: p.name,
      description: p.description,
      image: p.image,
      price: p.price,
      qty: p.qty,
    }));

    const categories = await knex("category")
      .select("id AS categoryId", "category_name AS name")
      .where("store_id", storeId);

    store.categories = categories.map((c) => ({
      id: c.categoryId,
      name: c.name,
    }));

    const promotions = await knex("promotion")
      .select(
        "id AS promId",
        "prom_description AS description",
        "prom_start_date AS startDate",
        "prom_end_date AS endDate",
        "discount_rate AS discountRate"
      )
      .where("store_id", storeId);

    store.promotions = promotions.map((p) => ({
      id: p.promId,
      description: p.description,
      startDate: p.startDate,
      endDate: p.endDate,
      discountRate: p.discountRate,
    }));

    const orders = await knex("store_order")
      .select(
        "id AS orderId",
        "order_date AS date",
        "order_status AS status",
        "order_total AS total"
      )
      .where("store_id", storeId);

    store.orders = orders.map((o) => ({
      id: o.orderId,
      date: o.date,
      status: o.status,
      total: o.total,
    }));

    return store;
  }

  //   update an existing store
  static async update(ownerId, data) {
    const store = await knex("store").where("owner_id", ownerId).first();

    if (!store) throw new NotFoundError("Store not found");

    const { storeName, storeId, colorScheme, siteFont, ...otherData } = data;

    const updatedStore = {
      store_name: storeName || store.store_name,
      id: storeId || store.id,
      color_scheme: colorScheme || store.color_scheme,
      site_font: siteFont || store.site_font,
      ...otherData,
    };

    await knex("store").where("owner_id", ownerId).update(updatedStore);

    return updatedStore;
  }

  static async delete(ownerId) {
    const count = await knex("store").where("owner_id", ownerId).delete();

    if (count === 0) throw new NotFoundError(`Store not found`);

    return `Store deleted`;
  }
}

module.exports = Store;


