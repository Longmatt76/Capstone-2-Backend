"use strict";

const knex = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Address {
  // lets user save an address to their account
  static async create(userId, { streetAddress, city, state, zipCode }) {
    const [address] = await knex("address")
      .insert({
        user_id: userId,
        street_address: streetAddress,
        city,
        state_residence: state,
        zip_code: zipCode,
      })
      .returning(["id AS addressId, user_id AS userId"]);

    if (!address) throw new BadRequestError("Address creation failed");
    return address;
  }

  //   lets user update existing address
  static async update(user_id, data) {
    const address = await knex("address").where("user_id", user_id).first();

    if (!address) throw new NotFoundError(`Address not found`);

    const updatedAddress = {
      ...address,
      ...data,
    };

    await knex("address").where("id", user_id).update(updatedAddress);

    return updatedAddress;
  }

  //   lets user delete existing address
  static async delete(user_id) {
    const count = await knex("address").where("id", user_id).delete();

    if (count === 0) throw new NotFoundError(`Address not found`);

    return `User with id:${user_id} address deleted`;
  }

};

module.exports = Address;