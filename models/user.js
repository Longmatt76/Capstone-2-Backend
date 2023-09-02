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
        "id AS userId",
        "username",
        "password",
        "first_name AS firstName",
        "last_name AS lastName",
        "email",
        "is_admin AS isAdmin"
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
  }

  //  creates a new user
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
      .returning(["id AS userId", "is_admin AS isAdmin"]);
    
    return user;
  }

  // retrieves user info with a relationship to the users addresses
  static async get(userId) {
    const user = await knex("user_info")
      .select(
        "id AS userId",
        "username",
        "email",
        "first_name AS firstName",
        "last_name AS lastName",
        "is_admin AS isAdmin"
      )
      .where("id", userId)
      .first();

    if (!user) throw new NotFoundError(`User not found`);

    const addresses = await knex("address")
      .select(
        "street_address AS streetAddress",
        "city",
        "state_residence AS state",
        "zip_code AS zipCode"
      )
      .where("user_id", userId);

    user.addresses = addresses.map((a) => ({
      streetAddress: a.streetAddress,
      city: a.city,
      state: a.state,
      zipCode: a.zipCode,
    }));

    return user;
  }

// updates an existing user and returns the updated user
static async update(userId, data) {
  const user = await knex("user_info").where("id", userId).first();

  if (!user) throw new NotFoundError(`User not found`);

  const { firstName, lastName, ...otherData } = data;

  const updatedUser = {
    first_name: firstName || user.first_name,
    last_name: lastName || user.last_name,
    ...otherData,
  };

  await knex("user_info").where("id", userId).update(updatedUser);

  return updatedUser;
}


  // deletes a users account
  static async delete(userId) {
    const count = await knex("user_info").where("id", userId).delete();

    if (count === 0) throw new NotFoundError(`User not found`);

    return `User with id:${userId} deleted`;
  };
};


module.exports = User;