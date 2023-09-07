"use strict";

const knex = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


class Category {

  // creates a new category
  static async create(storeId, { categoryName }) {
    const category = await knex("category")
      .insert({
        store_id: storeId,
        category_name: categoryName,
      })
      .returning("id AS categoryId", "category_name AS categoryName");

    return category;
  }

  //   retreives a single category and it's products
  static async get(categoryId) {
    const category = await knex("category")
      .select("id AS categoryId", "category_name AS categoryName")
      .where("id", categoryId)
      .first();

    if (!category) throw new NotFoundError("Category not found");

    const products = await knex("product")
      .select(
        "id AS productId",
        "category_id AS categoryId",
        "product_name AS name",
        "product_description AS description",
        "product_img AS image",
        "price",
        "qty_in_stock AS qty"
      )
      .where("category_id", categoryId);

    category.products = products.map((p) => ({
      id: p.productId,
      name: p.name,
      description: p.description,
      image: p.image,
      price: p.price,
      qty: p.qty,
    }));

    return category;
  }

  //  retrieves all categories and thier products from a single store
  static async getAll(storeId) {
    const categories = await knex("category")
      .select("id AS categoryId", "category_name AS categoryName")
      .where("store_id", storeId);
  
    // Create an array to store categories and their products
    const categoriesWithProducts = [];

    for (const category of categories) {
      const categoryId = category.categoryId;
  
      const products = await knex("product")
        .select(
          "id AS productId",
          "category_id AS categoryId",
          "product_name AS name",
          "product_description AS description",
          "product_img AS image",
          "price",
          "qty_in_stock AS qty"
        )
        .where("category_id", categoryId);
  
      const categoryWithProducts = {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        products: products.map((p) => ({
          id: p.productId,
          name: p.name,
          description: p.description,
          image: p.image,
          price: p.price,
          qty: p.qty,
        })),
      };
  
      categoriesWithProducts.push(categoryWithProducts);
    }
  
    return categoriesWithProducts;
  }
  

  //   update an existing category
  static async update(categoryId, data) {
    const category = await knex("category").where("id", categoryId).first();

    if (!category) throw new NotFoundError("Category not found");

    const { categoryName, ...otherData } = data;

    const updatedCategory = {
      category_name: categoryName || category.category_name,
      ...otherData,
    };

    await knex("category").where("id", categoryId).update(updatedCategory);

    return updatedCategory;
  }

//   delete an existing category
  static async delete(categoryId) {
    const count = await knex("category").where("id", categoryId).delete();

    if (count === 0) throw new NotFoundError(`Category not found`);

    return `Category deleted`;
  }
}

module.exports = Category;
