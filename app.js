"use strict";

const express = require("express");
const app = express();
const cors = require('cors');

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth")
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const ownerRoutes = require("./routes/owners");
const storeRoutes = require("./routes/stores");

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", userRoutes );
app.use("/owners", ownerRoutes);
app.use("/stores", storeRoutes);

// handle 404 errors
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// generic error handler
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
