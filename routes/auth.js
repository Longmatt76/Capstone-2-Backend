const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");

const User = require("../models/user");
const { createToken } = require('../helpers/tokens');
const userAuthSchema = require('../schema/userAuth.json');
const userNewSchema = require('../schema/userNew.json');
const { BadRequestError } = require('../expressError');


// creates and returns JWT token to authenticate further requests
router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

// creates new user and returns JWT token to authenticate further requests
// user must include {username, password, firstName, lastName, email}

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});


router.get("/", async function(req, res, next) {
  try{
    const users = await User.findAll();
    return res.json({users});
  }catch (err) {
    return next(err)
  }
});

module.exports = router; 