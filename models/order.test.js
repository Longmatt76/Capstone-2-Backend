"use strict";

const knex = require("../db");
const Order = require("./order");

const { commonBeforeAll, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll),
  afterAll(commonAfterAll),
  describe("create", function () {
    const userId = 1;
    const orderTotal = 100;
    const cart = [
      {
        storeId: 1,
        productId: 1,
        price: 10,
        quantity: 2,
      },
    ];
    test("works", async function () {
      const order = await Order.create(
        userId,
        orderTotal,
        JSON.stringify(cart)
      );
      expect(order.id).toEqual(1);
    });
  });

describe("get", function () {
  const orderId = 1;
  test("works", async function () {
    const order = await Order.get(orderId);
    expect(order.order_total).toEqual("100");
    expect(order.orderLines[0].qty).toEqual(2);
  });
});

describe("getAll", function () {
  const storeId = 1;
  test("works", async function () {
    const storeOrders = await Order.getAll(storeId);
    expect(storeOrders.length).toEqual(1);
    expect(storeOrders[0].order_status).toEqual("pending");
  });
});
