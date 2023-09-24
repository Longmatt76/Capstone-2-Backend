const knex = require("../db.js");
const bcrypt = require('bcrypt');
const  { BCRYPT_WORK_FACTOR } = require('../config.js');
const  { createUserToken, createOwnerToken } = require("../helpers/tokens.js")

async function commonBeforeAll() {
  await knex.raw(
    "TRUNCATE TABLE store_owner, store, user_info, address, carousel, category, store_order, order_line, product RESTART IDENTITY"
  );

  const testOwners =[ {
    username: "test_owner",
    password: await bcrypt.hash("password", BCRYPT_WORK_FACTOR),
    first_name: "Test",
    last_name: "Owner",
    email: "test@owner.com",
    is_admin: false,
  },
  {
    username: "test_owner_two",
    password: await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    first_name: "TestTwo",
    last_name: "Owner",
    email: "testTwo@owner.com",
    is_admin: false,
  }
];

  await knex("store_owner").insert(testOwners);

  const storeData = {
    owner_id: 1,
    store_name: "test_store",
  };

  await knex("store").insert(storeData);

  const testUser = {
    username: "test_user",
    password: await bcrypt.hash("password", BCRYPT_WORK_FACTOR),
    first_name: "Test",
    last_name: "User",
    email: "test@user.com",
    is_admin: false,
  };
  await knex("user_info").insert(testUser);

  const testCategory = {
    store_id: 1,
    category_name: "testCategory",
  };

  await knex("category").insert(testCategory);

  const testProducts = [
    {
      store_id: 1,
      category_id: 1,
      product_name: "testProductOne",
      brand: "testBrand",
      product_description: "testProductOneDescpription",
      product_img: "testImageOne",
      price: 10,
      qty_in_stock: 10,
    },
    {
      store_id: 1,
      category_id: 1,
      product_name: "testProductTwo",
      brand: "testBrand",
      product_description: "testProductTwoDescpription",
      product_img: "testImageTwo",
      price: 20,
      qty_in_stock: 20,
    },
  ];
  await knex("product").insert(testProducts);
}

async function commonAfterAll() {
  await knex.destroy();
}

const ownerToken = createOwnerToken({ownerId: 1, isAdmin: false })
const ownerTwoToken = createOwnerToken({ownerId: 2, isAdmin: false})
const userToken = createUserToken({userId: 1, isAdmin: false})


module.exports = {
  commonBeforeAll,
  commonAfterAll,
  ownerToken,
  ownerTwoToken,
  userToken
};
