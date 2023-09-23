"use strict";

const knex = require("../db");
const Owner = require("./owner");
const Store = require("./store");

const { commonBeforeAll, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll),
  afterAll(commonAfterAll),
  describe("authenticate", function () {
    test("works", async function () {
      const owner = await Owner.authenticate("test_owner", "password");
      expect(owner.firstName).toEqual("Test"),
        expect(owner.lastName).toEqual("Owner");
    });
  });

describe("register", function () {
  test("works", async function () {
    const testOwner2 = {
      username: "test_owner2",
      password: "password2",
      firstName: "Test2",
      lastName: "Owner2",
      email: "test2@owner.com",
      isAdmin: false,
    };

    const newOwner = await Owner.register(testOwner2);
    console.log(newOwner);
    expect(newOwner.ownerId).toEqual(3),
      expect(newOwner.isAdmin).toEqual(false)
  });
});

describe("get", function () {
  test("works", async function () {
    const owner = await Owner.get(3);
    expect(owner.firstName).toEqual("Test2"),
    expect(owner.email).toEqual("test2@owner.com");
  });
});

describe("update", function () {
  test("works", async function () {
    const owner = await Owner.get(3);
    const update = {
      firstName: "updatedFirstName",
    };
    const updatedOwner = await Owner.update(owner.ownerId, update);
    expect(updatedOwner.first_name).toEqual("updatedFirstName");
  });
});

describe("delete", function () {
    test("works", async function () {
      await Owner.delete(3);
      try {
        await Owner.get(3);
      } catch (err) {
        expect(err.message).toEqual("Owner not found");
      }
    });
  });
  