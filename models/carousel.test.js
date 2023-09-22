"use strict";

const knex = require("../db");
const Carousel = require("./carousel");

const { commonBeforeAll, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll),
  afterAll(commonAfterAll),
  
  describe("create", function () {
    test("works", async function () {
      let storeId = await knex("store")
        .select("id")
        .where("store_name", "test_store")
        .first();

      const carousel = await Carousel.create(
        storeId.id,
        "imageOne",
        "imageOneHeader",
        "imageOneText",
        "imageTwo",
        "imageTwoHeader",
        "imageTwoText"
      );
      expect(carousel).toEqual(carousel);
      expect(carousel.length).toEqual(1);
      expect(carousel[0].id).toEqual(1);
    });
  });

describe("get", function () {
  test("works", async function () {
    let storeId = await knex("store")
      .select("id")
      .where("store_name", "test_store")
      .first();

    const carousel = await Carousel.get(storeId.id);
    expect(carousel).toEqual(carousel);
    expect(carousel.imageTwoHeader).toEqual("imageTwoHeader");
  });
});

describe("update", function () {
  test("works", async function () {
    const newData = {
      imageOne: "newImageOne",
      imageOneHeader: "newImageOneHeader",
      imageOneText: "newImageOneText",
      imageTwo: "newImageTwo",
      imageTwoHeader: "newImageTwoHeader",
      imageTwoText: "newImageTwoText",
    };

    let storeId = await knex("store")
      .select("id")
      .where("store_name", "test_store")
      .first();
    const updatedCarousel = await Carousel.update(storeId.id, newData);
    expect(updatedCarousel.image_one).toEqual("newImageOne");
  });
});
