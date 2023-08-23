const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createUserToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    userId: user.userId,
    isAdmin: user.isAdmin || false,
  };
  return jwt.sign(payload, SECRET_KEY);
}


function createOwnerToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    ownerId: user.ownerId,
    isAdmin: user.isAdmin || true,
  };
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createUserToken, createOwnerToken};