"use strict";

const request = require("supertest");
const app = require("../app");

const {
  commonAfterAll,
  commonBeforeAll,
  userToken,
  ownerToken,
} = require("../models/_testCommon");

beforeAll(commonBeforeAll);
afterAll(commonAfterAll);

// **************************************** GET /users/:userId **************************

describe("GET /users/:userId", function () {
  test("works for correct user", async function () {
    const res = await request(app)
      .get(`/users/1`)
      .set("authorization", `Bearer ${userToken}`);
    expect(res.body).toEqual({
      user: {
        userId: 1,
        username: "test_user",
        email: "test@user.com",
        firstName: "Test",
        lastName: "User",
        isAdmin: false,
        addresses: [],
      },
    });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
      .get(`/users/1`)
      .set("authorization", `Bearer ${ownerToken}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(`/users/1`);
    expect(resp.statusCode).toEqual(401);
  });
});

// ************************************** PUT /users/:userId *********************************

describe("PUT /users/:userId", function () {
  test("works for correct user", async function () {
    const res = await request(app)
      .put(`/users/1`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${userToken}`);
    expect(res.body).toEqual({
      updatedUser: { first_name: "New", last_name: "User" },
    });
  });

  test("unauth if not correct user", async function () {
    const res = await request(app)
      .put(`/users/1`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.statusCode).toEqual(401);
  });
});

// ************************************* POST /users/address/:userId ******************************

describe("POST /users/address/:userId", function () {
  test("works for correct user", async function () {
    const res = await request(app)
      .post(`/users/address/1`)
      .send({
        streetAddress: "123 Test St",
        city: "Test City",
        state: "Ks",
        zipCode: "123456",
      })
      .set("authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.address.length).toEqual(1);
  });

  test("unauth for incorrect user", async function () {
    const res = await request(app)
      .post(`/users/address/1`)
      .send({
        streetAddress: "123 Test St",
        city: "Test City",
        state: "Ks",
        zipCode: "123456",
      })
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.statusCode).toEqual(401);
  });

  test("fails with bad data", async function () {
    const res = await request(app)
      .post(`/users/address/1`)
      .send({
        streetAddress: 33,
        city: "Test City",
        state: "Ks",
        zipCode: "123456",
      })
      .set("authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

// ********************************** PUT /users/address/:userId *******************************

describe("PUT /users/address/:userId", function () {
  test("works for correct user", async function () {
    const res = await request(app)
      .put(`/users/address/1`)
      .send({
        streetAddress: "123 NewTest St",
        city: "NewTest City",
        state: "Ks",
        zipCode: "123456",
      })
      .set("authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      updatedAddress: {
        street_address: "123 NewTest St",
        zip_code: "123456",
        state_residence: "Ks",
        city: "NewTest City",
      },
    });
  });

  test("unauth for incorrect user", async function () {
    const res = await request(app)
      .put(`/users/address/1`)
      .send({
        streetAddress: "123 Test St",
        city: "Test City",
        state: "Ks",
        zipCode: "123456",
      })
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.statusCode).toEqual(401);
  });

  test("fails with bad data", async function () {
    const res = await request(app)
      .put(`/users/address/1`)
      .send({
        streetAddress: 33,
        city: "Test City",
        state: "Ks",
        zipCode: "123456",
      })
      .set("authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

// ***************************************** DELETE /users/address/:userId *************************

describe("DELETE /users/address/:userId", function () {
  test("works for correct user", async function () {
    const res = await request(app)
      .delete(`/users/address/1`)
      .set("authorization", `Bearer ${userToken}`);
    expect(res.body).toEqual({ deleted: "1" });
  });

  test("unauth if wrong user", async function () {
    const res = await request(app)
      .delete(`/users/address/1`)
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app).delete(`/users/address/1`);
    expect(res.statusCode).toEqual(401);
  });
});

// // ************************************* DELETE /users/:userId ******************************

describe("DELETE /users/:userId", function () {
  test("works for correct user", async function () {
    const res = await request(app)
      .delete(`/users/1`)
      .set("authorization", `Bearer ${userToken}`);
    expect(res.body).toEqual({ deleted: "1" });
  });

  test("unauth if wrong user", async function () {
    const res = await request(app)
      .delete(`/users/1`)
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app).delete(`/users/1`);
    expect(res.statusCode).toEqual(401);
  });
});
