"use strict";

const knex = require("../db");
const Product = require("./product");
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

      const newProduct = {
        categoryName: "testCategory",
        productName: "testProductThree",
        product_description: "testProductThreeDescpription",
        brand: "testBrand",
        product_img: "testImageThree",
        price: 30,
        qty: 30,
      };

      const product = await Product.create(storeId.id, newProduct);
      expect(product.id).toEqual(3);
    });
  });

describe("get", function () {
  test("works", async function () {
    const product = await Product.get(3);
    expect(product).toEqual(product);
    expect(product.productName).toEqual("testProductThree");
    expect(product.price).toEqual("30");
    expect(product.qty).toEqual(30);
  });
});

describe("getAll", function () {
  test("works", async function () {
    let storeId = await knex("store")
      .select("id")
      .where("store_name", "test_store")
      .first();

    const products = await Product.getAll(storeId.id);
    expect(products.length).toEqual(3),
      expect(products[0].productName).toEqual("testProductOne");
    expect(products[1].productName).toEqual("testProductTwo");
    expect(products[2].productName).toEqual("testProductThree");
  });
});

describe("getAll /with filters", function () {
  test("works", async function () {
    let storeId = await knex("store")
      .select("id")
      .where("store_name", "test_store")
      .first();

    const searchFilters = {
      productSearch: "testProductOne",
    };

    const products = await Product.getAll(storeId.id, searchFilters);
    expect(products.length).toEqual(1),
      expect(products[0].productName).toEqual("testProductOne");
  });
});

describe("update", function () {
  test("works", async function () {
    const product = await Product.get(2);
    const update = {
      productName: "updatedProductName",
    };
    const updatedProduct = await Product.update(product.productId, update);
    expect(updatedProduct.product_name).toEqual("updatedProductName");
  });
});

describe("delete", function () {
    test("works", async function () {
      await Product.delete(2);
      try {
        await Product.get(2);
      } catch (err) {
        expect(err.message).toEqual("Product not found");
      }
    });
  });
  
