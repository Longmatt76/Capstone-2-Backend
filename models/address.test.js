"use strict";

const knex = require("../db");
const Address = require("./address");

const {
  commonBeforeAll,
  commonAfterAll,

} = require("./_testCommon");
const User = require("./user");

beforeAll(commonBeforeAll),
  afterAll(commonAfterAll),

  
  describe("create", function () {
    const newAddress = {
      streetAddress: "123 Test St.",
      city: "TestCity",
      state: "KS",
      zipCode: 123456,
    };

    test("works", async function () {
      let userId = await knex("user_info")
        .select("id")
        .where("username", "test_user")
        .first();

      const address = await Address.create(userId.id, newAddress);
      expect(address).toEqual(address);
      const found = await knex("address").select("*").where("city", "TestCity");
      expect(found.length).toEqual(1);
      expect(found[0].zip_code).toEqual(123456);
    });

    test("fails when wrong user", async function () {
      try {
        await Address.create(99, newAddress);
        fail();
      } catch (err) {
        expect(err.detail).toEqual(
          'Key (user_id)=(99) is not present in table "user_info".'
        );
      }
    });
  });

describe("update", function () {
  const updatedAddress = {
    streetAddress: "123 Test St.",
    city: "TestCity",
    state: "KS",
    zipCode: 654321,
  };

  test("works", async function () {
    let userId = await knex("user_info")
      .select("id")
      .where("username", "test_user")
      .first();

    const newAddress = await Address.update(userId.id, updatedAddress);
    expect(newAddress).toEqual(newAddress);
    const found = await knex("address").select("*").where("city", "TestCity");
    expect(found.length).toEqual(1);
    expect(found[0].zip_code).toEqual(654321);
  });

  test("fails with bad data", async function () {
    const badData = {
      streetAddress: "123 Test St.",
      city: "TestCity",
      state: "KS",
      zipCode: "this needs to be a number",
    };

    let userId = await knex("user_info")
      .select("id")
      .where("username", "test_user")
      .first();

    try {
      await Address.update(userId.id, badData);
    } catch (err) {
      expect(err.code).toEqual("22P02");
    }
  });
});

describe("delete", function () {
  test("works", async function () {
    let userId = await knex("user_info")
      .select("id")
      .where("username", "test_user")
      .first();
    await Address.delete(userId.id);
    const user = await User.get(userId.id);
    expect(user.addresses.length).toEqual(0);
  });
});
