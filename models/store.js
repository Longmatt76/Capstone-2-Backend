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
  static async create(ownerId, { storeName, logo, theme }) {
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
        "theme"
      )
      .where("owner_id", ownerId)
      .first();

    if (!store) throw new NotFoundError("Store not found");

    return store;
  }

  //   update an existing store
  static async update(ownerId, data) {
    const store = await knex("store").where("owner_id", ownerId).first();

    if (!store) throw new NotFoundError("Store not found");

    const { storeName, ...otherData } = data;

    const updatedStore = {
      store_name: storeName || store.store_name,
      ...otherData,
    };

    await knex("store").where("id", storeId).update(updatedStore);

    return updatedStore;
  }

  static async delete(ownerId) {
    const count = await knex("store").where("owner_id", ownerId).delete();

    if (count === 0) throw new NotFoundError(`Store not found`);

    return `Store deleted`;
  }
}

module.exports = Store;
