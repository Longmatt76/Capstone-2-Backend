"use strict";

const knex = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");


class Owner {
  // authenticate store owner with username, password; returns owner
  static async authenticate(username, password) {
    const owner = await knex("store_owner")
      .select(
        "id AS ownerId",
        "username",
        "password",
        "first_name AS firstName",
        "last_name AS lastName",
        "email",
        "roles",
        "is_admin AS isAdmin"
      )
      .where("username", username)
      .first();

    if (owner) {
      const isValid = await bcrypt.compare(password, owner.password);
      if (isValid === true) {
        delete owner.password;
        return owner;
      }
    }
    throw new UnauthorizedError("Invalid username or password");
  }

  //  creates a new store owner
  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    isAdmin,
    roles,
  }) {
    const duplicateUser = await knex("store_owner")
      .where("username", username)
      .first();
    if (duplicateUser) {
      throw new BadRequestError(`Username: ${username} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const [user] = await knex("store_owner")
      .insert({
        username,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        email,
        is_admin: isAdmin || false,
        roles: roles || "owner",
      })
      .returning(["id AS ownerId", "is_admin AS isAdmin"]);

    return user;
  }

  // retrieves a store owners info
  static async get(ownerId) {
    const owner = await knex("store_owner")
      .select(
        "id AS ownerId",
        "username",
        "email",
        "first_name AS firstName",
        "last_name AS lastName",
        "roles",
        "is_admin AS isAdmin"
      )
      .where("id", ownerId)
      .first();

    if (!owner) throw new NotFoundError(`Owner not found`);

    return owner;
  }

  // updates an existing user and returns the updated user
  static async update(ownerId, data) {
    const owner = await knex("store_owner").where("id", ownerId).first();

    if (!owner)
      throw new NotFoundError(`Store owner with id ${ownerId} not found`);

    const { firstName, lastName, ...otherData } = data;

    const updatedOwner = {
      first_name: firstName || owner.first_name,
      last_name: lastName || owner.last_name,
      ...otherData,
    };

    await knex("store_owner").where("id", ownerId).update(updatedOwner);

    return updatedOwner;
  }

  // deletes a users account
  static async delete(ownerId) {
    const count = await knex("store_owner").where("id", ownerId).delete();

    if (count === 0) throw new NotFoundError(`User not found`);

    return `Store owner with id:${ownerId} deleted`;
  }
};

module.exports = Owner; 