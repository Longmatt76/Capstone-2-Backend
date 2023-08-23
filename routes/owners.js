const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError } = require('../expressError');
const Owner = require("../models/owner");
const { ensureCorrectStoreOwnerOrAdmin } = require("../middleware/auth");
const ownerUpdateSchema = require("../schema/userUpdate.json");

// retreives a single stores owner's info, middleware ensures correct owner
router.get(
  "/:ownerId",
  ensureCorrectStoreOwnerOrAdmin,
  async function (req, res, next) {
    try {
      const owner = await Owner.get(req.params.ownerId);
      return res.json({ owner });
    } catch (err) {
      return next(err);
    }
  }
);

// updates a single store owner, middleware ensures correct owner
router.put(
    "/:ownerId",
    ensureCorrectStoreOwnerOrAdmin,
    async function (req, res, next) {
      try {
        const validator = jsonschema.validate(req.body, ownerUpdateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map((e) => e.stack);
          throw new BadRequestError(errs);
        }
  
        const updatedOwner = await Owner.update(req.params.ownerId, req.body);
        return res.json({ updatedOwner });
      } catch (err) {
        return next(err);
      }
    }
  );
  
//   delete a single store owner, middleware ensures correct owner
  router.delete(
    "/:ownerId",
    ensureCorrectStoreOwnerOrAdmin,
    async function (req, res, next) {
      try {
        await Owner.delete(req.params.ownerId);
        return res.json({ deleted: req.params.ownerId });
      } catch (err) {
        return next(err);
      }
    }
  );


module.exports = router;