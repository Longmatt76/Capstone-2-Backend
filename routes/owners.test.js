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

// **************************************** GET /owners/:ownerId **************************

describe("GET /owners/:ownerId", function () {
  test("works for correct owner", async function () {
    const res = await request(app)
      .get(`/owners/1`)
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.body).toEqual({
      owner: {
        ownerId: 1,
        username: "test_owner",
        email: "test@owner.com",
        firstName: "Test",
        lastName: "Owner",
        roles: null,
        isAdmin: false,
      },
    });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
      .get(`/owners/1`)
      .set("authorization", `Bearer ${userToken}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(`/owners/1`);
    expect(resp.statusCode).toEqual(401);
  });
});

// ************************************** PUT /owners/:ownerId *********************************

describe("PUT /owners/:ownerId", function () {
  test("works for correct owner", async function () {
    const res = await request(app)
      .put(`/owners/1`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.body).toEqual({
      updatedOwner: { first_name: "New", last_name: "Owner" },
    });
  });

  test("unauth if not correct owner", async function () {
    const res = await request(app)
      .put(`/owners/1`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(401);
  });
});

// ************************************* DELETE /owners/:ownerId ******************************

describe("DELETE /owners/:ownerId", function () {
  test("works for correct owner", async function () {
    const res = await request(app)
      .delete(`/owners/1`)
      .set("authorization", `Bearer ${ownerToken}`);
    expect(res.body).toEqual({ deleted: "1" });
  });

  test("unauth if wrong owner", async function () {
    const res = await request(app)
      .delete(`/owners/1`)
      .set("authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const res = await request(app).delete(`/owners/1`);
    expect(res.statusCode).toEqual(401);
  });
});
