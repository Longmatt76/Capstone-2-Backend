"use strict";

const knex = require("../db");
const { NotFoundError } = require("../expressError");

class Carousel {
  static async create(
    storeId,
    imageOne,
    imageOneHeader,
    imageOneText,
    imageTwo,
    imageTwoHeader,
    imageTwoText
  ) {
    const carousel = await knex("carousel")
      .insert({
        store_id: storeId,
        image_one: imageOne,
        image_one_header: imageOneHeader,
        image_one_text: imageOneText,
        image_two: imageTwo,
        image_two_header: imageTwoHeader,
        image_two_text: imageTwoText,
      })
      .returning("id");

    return carousel;
  }

  static async get(storeId) {
    const carousel = await knex("carousel")
      .select(
        "image_one AS imageOne",
        "image_one_header AS imageOneHeader",
        "image_one_text AS imageOneText",
        "image_two AS imageTwo",
        "image_two_header AS imageTwoHeader",
        "image_two_text AS imageTwoText"
      )
      .where("store_id", storeId)
      .first();

    return carousel;
  }

  static async update(storeId, data) {
    const carousel = await knex("carousel").where("store_id", storeId).first();

    if (!carousel) throw new NotFoundError("Carousel not found");

    const {
      imageOne,
      imageOneHeader,
      imageOneText,
      imageTwo,
      imageTwoHeader,
      imageTwoText,
    } = data;

    const updatedCarousel = {
      store_id: storeId || carousel.store_id,
      image_one: imageOne || carousel.image_one,
      image_one_header: imageOneHeader || carousel.image_one_header,
      image_one_text: imageOneText || carousel.image_one_text,
      image_two: imageTwo || carousel.image_two,
      image_two_header: imageTwoHeader || carousel.image_two_header,
      image_two_text: imageTwoText || carousel.image_two_text,
    };

    await knex("carousel").where("store_id", storeId).update(updatedCarousel);

    return updatedCarousel;
  }
}

module.exports = Carousel;
