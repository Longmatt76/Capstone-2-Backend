const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError } = require('../expressError');
const User = require("../models/user");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const userUpdateSchema = require("../schema/userUpdate.json");
const newAddressSchema = require("../schema/newAddress.json");
const updateAddressSchema = require("../schema/updateAddress.json");
const Address = require("../models/address");


// get a single user by id, middleware verifies correct user
router.get(
  "/:userId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.userId);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

// updates a single user, middleware ensures correct users
router.put(
  "/:userId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const updatedUser = await User.update(req.params.userId, req.body);
      return res.json({ updatedUser });
    } catch (err) {
      return next(err);
    }
  }
);

// removes a users account, middleware ensures correct user
router.delete(
  "/:userId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      await User.delete(req.params.userId);
      return res.json({ deleted: req.params.userId });
    } catch (err) {
      return next(err);
    }
  }
);

// ***********************USER ADDRESS ROUTES******************************

// creates a new user address 
router.post(
  "/address/:userId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, newAddressSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const address = await Address.create(req.params.userId, { ...req.body });
      return res.json({ address });
    } catch (err) {
      return next(err);
    }
  }
);

// allows user to update existing address
router.put(
  "/address/:userId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, updateAddressSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const updatedAddress = await Address.update(
        req.params.userId,
        req.body
      );
      return res.json({ updatedAddress });
    } catch (err) {
      return next(err);
    }
  }
);

// deletes a users stored address
router.delete(
  "/address/:userId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      await Address.delete(req.params.userId);
      return res.json({ deleted: req.params.userId});
    } catch (err) {
      return next(err);
    }
  }
);


module.exports = router;