"use strict";

const knex = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  // authenticate user with username, password; returns user
  static async authenticate(username, password) {
    const user = await knex("user_info")
      .select(
        "username",
        "password",
        "first_name AS firstName",
        "last_name AS lastName",
        "email"
      )
      .where("username", username)
      .first();

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username or password");
  }

  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    isAdmin,
  }) {
    const duplicateUser = await knex("user_info")
      .where("username", username)
      .first();
    if (duplicateUser) {
      throw new BadRequestError(`Username: ${username} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const [user] = await knex("user_info")
      .insert({
        username,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        email,
        is_admin: isAdmin || false,
      })
      .returning([
        "username",
        "email",
      ]);

    return user;
  };

  static async findAll() {
    const users = await knex("user_info")
      .select('username', 'first_name AS firstName', 'last_name AS lastName', 'email', 'is_admin AS isAdmin')
      .orderBy('username');

    return users;
  }
}


module.exports = User;