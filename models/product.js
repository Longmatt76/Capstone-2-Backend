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
    { categoryName, productName, productDescription, image, price, qty, brand }
  ) {
    const transaction = await knex.transaction();
    let categoryId;
    try {
      // Check if the category exists
      const categoryCheck = await transaction("category")
        .where("category_name", categoryName)
        .andWhere("store_id", storeId)
        .first();

      if (categoryCheck === null || categoryCheck === undefined) {
        // Create the category
        const [newCategoryId] = await transaction("category")
          .insert({
            store_id: storeId,
            category_name: categoryName,
          })
          .returning("id");

        categoryId = newCategoryId;
      } else {
        categoryId = categoryCheck.categoryId;
      }

      // Insert the product
      const [productId] = await transaction("product")
        .insert({
          store_id: storeId,
          category_id: categoryId.id,
          brand,
          product_name: productName,
          product_description: productDescription,
          product_img: image,
          price: parseFloat(price),
          qty_in_stock: parseInt(qty),
        })
        .returning("id");

      await transaction.commit();

      return productId;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
  //   retreives a single product
  static async get(productId) {
    const product = await knex("product")
      .select(
        "product.id AS productId",
        "product.store_id AS storeId",
        "product.category_id AS categoryId",
        "product.product_name AS productName",
        "product.brand",
        "product.product_description AS productDescription",
        "product.product_img AS image",
        "product.price",
        "product.qty_in_stock AS qty",
        "category.category_name AS categoryName"
      )
      .where("product.id", productId)
      .leftJoin("category", "product.category_id", "category.id")
      .first();

    if (!product) throw new NotFoundError("Product not found");

    return product;
  }

  //  retrieves all products from a single store and sorts by productName
  //  and a desired priceRange, joins with category table for access to categoryName
  static async getAll(storeId, searchFilters = {}) {
    const { productSearch, priceRange } = searchFilters;

    const products = await knex("product")
      .select(
        "product.id AS productId",
        "product.store_id AS storeId",
        "product.category_id AS categoryId",
        "product.product_name AS productName",
        "product.brand AS brand",
        "product.product_description AS productDescription",
        "product.product_img AS image",
        "product.price",
        "product.qty_in_stock AS qty",
        "category.category_name AS categoryName"
      )
      .where("product.store_id", storeId)
      .leftJoin("category", "product.category_id", "category.id");

    if (productSearch) {
      products.where("product.product_name", "ilike", `%${productSearch}%`);
    }

    if (priceRange && priceRange.length === 2) {
      const [minPrice, maxPrice] = priceRange;
      products.whereBetween("product.price", [minPrice, maxPrice]);
    }

    return products;
  }

  //   update an existing product
  static async update(productId, data) {
    const product = await knex("product").where("id", productId).first();

    if (!product) throw new NotFoundError("Product not found");

    const {
      productName,
      productDescription,
      qty,
      image,
      price,
      storeId,
      categoryId,
      ...otherData
    } = data;

    const parsedPrice = parseFloat(price);
    const parsedQty = parseInt(qty);

    const updatedProduct = {
      product_name: productName || product.product_name,
      product_description: productDescription || product.product_description,
      product_img: image || product.product_img,
      qty_in_stock: parsedQty || product.qty_in_stock,
      price: parsedPrice || product.price,
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
