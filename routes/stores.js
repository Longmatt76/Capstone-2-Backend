const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const Store = require("../models/store");
const Category = require("../models/category");
const Product = require("../models/product");
const Carousel = require("../models/carousel");
const Order = require("../models/order");
const { ensureCorrectStoreOwnerOrAdmin } = require("../middleware/auth");
const newStoreSchema = require("../schema/newStore.json");
const updateStoreSchema = require("../schema/updateStore.json");
const newCategorySchema = require("../schema/newCategory.json");
const updateCategorySchema = require("../schema/updateCategory.json");
const newProductSchema = require("../schema/newProduct.json");
const updateProductSchema = require("../schema/updateProduct.json");

// creates a new store
router.post(
  "/:ownerId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, newStoreSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const store = await Store.create(req.params.ownerId, { ...req.body });
      return res.json({ store });
    } catch (err) {
      return next(err);
    }
  }
);

// get a single store by id
router.get(
  "/:storeId",
  async function (req, res, next) {
    try {
      const store = await Store.get(req.params.storeId);
      return res.json({ store });
    } catch (err) {
      return next(err);
    }
  }
);

// updates a single store, middleware ensures correct store owner
router.put(
  "/:ownerId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, updateStoreSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const updatedStore = await Store.update(req.params.ownerId, req.body);
      return res.json({ updatedStore });
    } catch (err) {
      return next(err);
    }
  }
);

//   deletes a single store, middleware verifies correct store owner
router.delete(
  "/:ownerId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      await Store.delete(req.params.ownerId);
      return res.json({ deleted: req.params.ownerId });
    } catch (err) {
      return next(err);
    }
  }
);

// **********************************Category Routes******************************************

// creates a new category
router.post(
  "/:ownerId/categories/:storeId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, newCategorySchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const category = await Category.create(req.params.storeId, {
        ...req.body,
      });
      return res.json({ category });
    } catch (err) {
      return next(err);
    }
  }
);

// get a single category by id, middleware verifies correct store owner
router.get(
  "/:ownerId/categories/:categoryId",
  async function (req, res, next) {
    try {
      const category = await Category.get(req.params.categoryId);
      return res.json({ category });
    } catch (err) {
      return next(err);
    }
  }
);

// gets all categories from a single store
router.get(
  "/:ownerId/categories/all/:storeId",
  async function (req, res, next) {
    try {
      const categories = await Category.getAll(req.params.storeId);
      return res.json({ categories });
    } catch (err) {
      return next(err);
    }
  }
);

// updates a single category, middleware ensures correct store owner
router.put(
  "/:ownerId/categories/:categoryId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, updateCategorySchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const updatedCategory = await Category.update(
        req.params.categoryId,
        req.body
      );
      return res.json({ updatedCategory });
    } catch (err) {
      return next(err);
    }
  }
);

//   deletes a single category, middleware verifies correct store owner
router.delete(
  "/:ownerId/categories/:categoryId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      await Category.delete(req.params.categoryId);
      return res.json({ deleted: req.params.ownerId });
    } catch (err) {
      return next(err);
    }
  }
);

// *************************************Product Routes****************************************

// creates a new product
router.post(
  "/:ownerId/products/:storeId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, newProductSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const product = await Product.create(req.params.storeId, { ...req.body });
      return res.json({ product });
    } catch (err) {
      return next(err);
    }
  }
);

// get a single product by id, middleware verifies correct store owner
router.get("/:ownerId/products/:productId", async function (req, res, next) {
  try {
    const product = await Product.get(req.params.productId);
    return res.json({ product });
  } catch (err) {
    return next(err);
  }
});

// gets all products from a single store, allows for filtering by product name
// and priceRange, middleware verifies the correct store owner
router.get("/:ownerId/products/all/:storeId", async function (req, res, next) {
  const { productSearch, priceRange } = req.query;
  const searchFilters = {};

  if (productSearch) {
    searchFilters.productSearch = productSearch;
  }

  if (priceRange) {
    // Assuming priceRange is a string in the format "minPrice-maxPrice"
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    searchFilters.priceRange = [minPrice, maxPrice];
  }

  try {
    const products = await Product.getAll(req.params.storeId, searchFilters);
    return res.json({ products });
  } catch (err) {
    return next(err);
  }
});

// updates a single product, middleware ensures correct store owner
router.put(
  "/:ownerId/products/:productId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, updateProductSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const updatedProduct = await Product.update(
        req.params.productId,
        req.body
      );
      return res.json({ updatedProduct });
    } catch (err) {
      return next(err);
    }
  }
);

//   deletes a single product, middleware verifies correct store owner
router.delete(
  "/:ownerId/products/:productId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      await Product.delete(req.params.productId);
      return res.json({ deleted: req.params.ownerId });
    } catch (err) {
      return next(err);
    }
  }
);

// *************************************** Carousel Routes************************************

router.post(
  "/:ownerId/carousel/:storeId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const {
        imageOne,
        imageOneHeader,
        imageOneText,
        imageTwo,
        imageTwoHeader,
        imageTwoText
      } = req.body;

      const carousel = await Carousel.create(
        req.params.storeId,
        imageOne,
        imageOneHeader,
        imageOneText,
        imageTwo,
        imageTwoHeader,
        imageTwoText
      );

      return res.json({ carousel });
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/:ownerId/carousel/:storeId",
  async function (req, res, next) {
    try {
      const carousel = await Carousel.get(req.params.storeId);
      return res.json({ carousel });
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  "/:ownerId/carousel/:storeId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const updatedCarousel = await Carousel.update(req.params.storeId, req.body);
      return res.json({updatedCarousel})
    }catch (err) {
      return next(err);
    }
  }
);

module.exports = router;


// **************************************** ORDERS routes ***************************************

// get a single category by id, middleware verifies correct store owner
router.get(
  "/:ownerId/orders/:orderId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const order = await Category.get(req.params.orderId);
      return res.json({ order });
    } catch (err) {
      return next(err);
    }
  }
);


// gets all orders from a single store, middleware verifies correct store owner
router.get(
  "/:ownerId/orders/all/:storeId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const orders = await Order.getAll(req.params.storeId);
      return res.json({ orders });
    } catch (err) {
      return next(err);
    }
  }
);
