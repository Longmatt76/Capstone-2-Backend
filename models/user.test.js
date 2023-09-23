"use strict";

const knex = require("../db");
const User = require("./user");

const { commonBeforeAll, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll),
  afterAll(commonAfterAll),
  describe("authenticate", function () {
    test("works", async function () {
      const user = await User.authenticate("test_user", "password");
      expect(user.firstName).toEqual("Test"),
        expect(user.lastName).toEqual("User");
    });
  });

describe("register", function () {
  test("works", async function () {
    const testUser2 = {
      username: "test_user2",
      password: "password2",
      firstName: "Test2",
      lastName: "User2",
      email: "test2@user.com",
      isAdmin: false,
    };

    const newUser = await User.register(testUser2);
    expect(newUser.userId).toEqual(2),
      expect(newUser.isAdmin).toEqual(false)
  });
});

describe("get", function () {
    test("works", async function () {
      const user = await User.get(2);
      expect(user.firstName).toEqual("Test2"),
      expect(user.email).toEqual("test2@user.com");
    });
  });

  describe("update", function () {
    test("works", async function () {
      const user = await User.get(2);
      const update = {
        firstName: "updatedFirstName",
      };
      const updatedUser = await User.update(user.userId, update);
      expect(updatedUser.first_name).toEqual("updatedFirstName");
    });
  });

describe("delete", function () {
  test("works", async function () {
    await User.delete(2);
    try {
      await User.get(2);
    } catch (err) {
      expect(err.message).toEqual("User not found");
    }
  });
});
