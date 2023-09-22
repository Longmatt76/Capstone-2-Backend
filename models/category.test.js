"use strict";

const knex = require("../db");
const Category = require("./category");
const Store = require("./store");

const { commonBeforeAll, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll),
  afterAll(commonAfterAll),
  describe("create", function () {
    test("works", async function () {
      let storeId = await knex("store")
        .select("id")
        .where("store_name", "test_store")
        .first();

      const categoryName = {
        categoryName: "newCategory",
      };

      const category = await Category.create(storeId.id, categoryName);
      expect(category).toEqual(category);
      expect(category.length).toEqual(1);
      expect(category[0].categoryId).toEqual(2);
    });
  });

describe("get", function () {
  test("works", async function () {
    const category = await Category.get(2);
    expect(category).toEqual(category);
    expect(category.categoryName).toEqual("newCategory");
  });
});

describe("getAll", function () {
  test("works", async function () {
    let storeId = await knex("store")
      .select("id")
      .where("store_name", "test_store")
      .first();

    const categoryName = {
      categoryName: "secondCategory",
    };

    await Category.create(storeId.id, categoryName);
    const categories = await Category.getAll(storeId.id);
    expect(categories).toEqual(categories);
    expect(categories.length).toEqual(3);
    expect(categories[2].categoryName).toEqual("secondCategory");
  });
});

describe("update", function () {
  test("works", async function () {
    const category = await Category.get(2);
    const update = {
      categoryName: "updatedCategory",
    };
    const updatedCategory = await Category.update(category.categoryId, update);
    expect(updatedCategory.category_name).toEqual("updatedCategory");
  });
});

describe("delete", function () {
  test("works", async function () {
    let storeId = await knex("store")
      .select("id")
      .where("store_name", "test_store")
      .first();
    await Category.delete(2);
    await Category.delete(3);
    const store = await Store.get(storeId.id);
    expect(store.categories.length).toEqual(1);
  });
});
