const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError } = require('../expressError');
const Store = require('../models/store');
const { ensureCorrectStoreOwnerOrAdmin } = require("../middleware/auth");
const newStoreSchema = require("../schema/newStore.json");
const updateStoreSchema = require("../schema/updateStore.json");


// creates a new store
router.post(
    "/stores/:ownerId",
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

  // get a single store by id, middleware verifies correct store owner
router.get(
    "/:ownerId",
    ensureCorrectStoreOwnerOrAdmin,
    async function (req, res, next) {
      try {
        const store = await Store.get(req.params.ownerId);
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
  



module.exports = router;
