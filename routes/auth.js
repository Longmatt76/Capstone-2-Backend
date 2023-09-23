const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");

const User = require("../models/user");
const Owner = require("../models/owner");
const { createUserToken, createOwnerToken} = require('../helpers/tokens');
const userAuthSchema = require('../schema/userAuth.json');
const userNewSchema = require('../schema/userNew.json');
const ownerNewSchema = require('../schema/ownerNew.json');
const { BadRequestError } = require('../expressError');


// Unified login route for both users and owners
router.post("/token", async function (req, res, next) {
  try {
    
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      console.log('Request Body:', req.body);
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    
    const { username, password } = req.body;
    
    // Check if the user is a regular user
    const user = await User.authenticate(username, password);
    if (user) {
      const token = createUserToken(user);
      return res.json({ token });
    }

    // Check if the user is a store owner
    const owner = await Owner.authenticate(username, password);
    if (owner) {
      const token = createOwnerToken(owner);
      return res.json({ token });
    }

    throw new UnauthorizedError("Invalid username or password");
  } catch (err) {
    return next(err);
  }
});


// creates new user and returns JWT token to authenticate further requests
// user must include {username, password, firstName, lastName, email}
router.post("/register-user", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createUserToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});


// creates a new store owner account and returns a JWT token with admin privledges
router.post("/register-owner", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, ownerNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const newOwner = await Owner.register({ ...req.body, isAdmin: false });
    const token = createOwnerToken(newOwner);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});




module.exports = router; 