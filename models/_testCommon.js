const knex = require("../db.js");

async function commonBeforeAll() {
  await knex.raw(
    "TRUNCATE TABLE store_owner, store, user_info, address, carousel, category, store_order, order_line, product RESTART IDENTITY"
  );

  const testOwner = {
    username: "test_owner",
    password: "password",
    first_name: "Test",
    last_name: "Owner",
    email: "test@owner.com",
    is_admin: false,
  };

  await knex("store_owner").insert(testOwner);

  const storeData = {
    owner_id: 1,
    store_name: "test_store",
  };

  await knex("store").insert(storeData);

  const testUser = {
    username: "test_user",
    password: "password",
    first_name: "test",
    last_name: "user",
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

module.exports = {
  commonBeforeAll,
  commonAfterAll,
};
