"use strict";

const e = require("express");
const knex = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Product {
  // creates a new product for a single store, checks for existing
  // category,if none exists it first creates category then the product
  static async create(
    storeId,
    { categoryName, productName, productDescription, image, price, qty }
  ) {
    // Check if the category exists
    const categoryCheck = await knex("category")
      .select("id AS categoryId", "category_name AS categoryName")
      .where("category_name", categoryName)
      .andWhere("store_id", storeId)
      .first();

    let categoryId;

    if (!categoryCheck) {
      // If the category doesn't exist, create it
      const [newCategoryId] = await knex("category")
        .insert({
          store_id: storeId,
          category_name: categoryName,
        })
        .returning("id");
      categoryId = +newCategoryId;
    } else {
      categoryId = +categoryCheck.categoryId;
    }

    // Insert the product
    const [productId] = await knex("product")
      .insert({
        store_id: storeId,
        category_id: categoryId,
        product_name: productName,
        product_description: productDescription,
        product_img: image,
        price,
        qty_in_stock: qty,
      })
      .returning("id");

    return productId;
  }

  //   retreives a single product
  static async get(productId) {
    const product = await knex("product")
      .select(
        "id AS productId",
        "store_id AS storeId",
        "category_id AS categoryId",
        "product_name AS productName",
        "product_description AS productDescription",
        "product_img AS image",
        "price",
        "qty_in_stock AS qty"
      )
      .where("id", productId)
      .first();

    if (!product) throw new NotFoundError("Product not found");

    return product;
  }

  //  retrieves all products from a single store and sorts by productName and a desired priceRange
  static async getAll(storeId, searchFilters = {}) {
    const { productSearch, priceRange } = searchFilters;
    let productsQuery = knex("product")
      .select(
        "id AS productId",
        "store_id AS storeId",
        "category_id AS categoryId",
        "product_name AS productName",
        "product_description AS productDescription",
        "product_img AS image",
        "price",
        "qty_in_stock AS qty"
      )
      .where("store_id", storeId);
  
    if (productSearch) {
      productsQuery = productsQuery.whereILike("product_name", `%${productSearch}%`);
    }
  
    if (priceRange && priceRange.length === 2) {
      const [minPrice, maxPrice] = priceRange;
      productsQuery = productsQuery.andWhereBetween("price", [minPrice, maxPrice]);
    }
  
    const products = await productsQuery;
  
    return products;
  }
  

  //   update an existing product
  static async update(productId, data) {
    const product = await knex("product").where("id", productId).first();

    if (!product) throw new NotFoundError("Product not found");

    const { productName, productDescription, qty, image, price, storeId, categoryId, ...otherData } = data;

    const updatedProduct = {
      product_name: productName || product.product_name,
      product_description: productDescription || product.product_description,
      product_img: image || product.product_img,
      qty_in_stock: qty || product.qty_in_stock,
      price: +price || product.price,
      store_id: storeId || product.store_id,
      category_id: categoryId || product.category_id,
      ...otherData,
    };

    await knex("product").where("id", productId).update(updatedProduct);

    return updatedProduct;
  }

  //   delete an existing product
  static async delete(productId) {
    const count = await knex("product").where("id", productId).delete();

    if (count === 0) throw new NotFoundError(`Product not found`);

    return `Product deleted`;
  }
}

module.exports = Product;
