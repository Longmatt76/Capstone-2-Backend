const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonAfterAll,
  userToken,
} = require("../models/_testCommon");

beforeAll(commonBeforeAll);
afterAll(commonAfterAll);

const mockCartItems = [
  {
    productName: "Product 1",
    image: "product1.jpg",
    productDescription: "Description 1",
    price: 10.0,
    quantity: 2,
  },
  {
    productName: "Product 2",
    image: "product2.jpg",
    productDescription: "Description 2",
    price: 20.0,
    quantity: 1,
  },
];

describe("POST /checkout/:ownerId/create-session/:userId", function () {
  test("creates a Stripe checkout session", async function () {
    const res = await request(app)
      .post("/checkout/1/create-session/1")
      .set("authorization", `Bearer ${userToken}`)
      .send({ cartItems: mockCartItems });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("url");
    expect(res.body.url).toContain("https://checkout.stripe.com");
  });

});
