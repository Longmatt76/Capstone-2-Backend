"use strict";

const knex = require("../db");
const Store = require("./store");

const { commonBeforeAll, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll),
  afterAll(commonAfterAll),
  describe("create", function () {
    test("works", async function () {
    const owner =  await knex("store_owner").select("id").where("first_name", 'TestTwo')
        const storeData = {
            storeName: "test_store_two",
          };

      const newStore = await Store.create(owner[0].id, storeData);
      expect(newStore).toEqual(newStore);
      expect(newStore[0].storeId).toEqual(2)
    });
  });

describe("get", function () {
  test("works", async function () {
    const store = await Store.get(1);
    expect(store).toEqual(store);
    expect(store.storeName).toEqual('test_store'),
    expect(store.products.length).toEqual(2)
    expect(store.categories.length).toEqual(1)
  });
});


describe("update", function () {
  test("works", async function () {
    
    const update = {
      storeName: "updatedStoreName",
    };
    const updatedStore = await Store.update(2, update);
    expect(updatedStore.store_name).toEqual("updatedStoreName");
  });
});

describe("delete", function () {
    test("works", async function () {
      await Store.delete(2);
      try {
        await Store.get(2);
      } catch (err) {
        expect(err.message).toEqual("Store not found");
      }
    });
  });
