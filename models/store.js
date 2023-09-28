"use strict";

const knex = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Store {
  // creates a new store
  static async create(ownerId, { storeName, logo, theme, siteFont }) {
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
        theme,
        site_font: siteFont,
      })
      .returning("id AS storeId", "store_name AS storeName");

    return store;
  }


  //  retrieves a single store's info
  static async get(storeId) {
    const store = await knex("store")
      .select(
        "id AS storeId",
        "owner_id AS ownerId",
        "store_name AS storeName",
        "logo",
        "theme",
        "site_font AS siteFont"
      )
      .where("id", storeId)
      .first();

    if (!store) throw new NotFoundError("Store not found");

    const products = await knex("product")
      .select(
        "id AS productId",
        "category_id AS categoryId",
        "product_name AS name",
        "product_description AS description",
        "product_img AS image",
        "price",
        "qty_in_stock AS qty"
      )
      .where("store_id", storeId);

    store.products = products.map((p) => ({
      id: p.productId,
      categoryId: p.categoryId,
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

    const { storeName, storeId, siteFont, ...otherData } = data;

    const updatedStore = {
      store_name: storeName || store.store_name,
      id: storeId || store.id,
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


