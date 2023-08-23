const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError } = require('../expressError');
const User = require("../models/user");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const userUpdateSchema = require("../schema/userUpdate.json");


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



module.exports = router;