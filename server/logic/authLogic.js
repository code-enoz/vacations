// service for jwt
// nn this authLogic anymore

// import * as jwt from 'jsonwebtoken';
const jwt = require("jsonwebtoken");
const config = require("../config.json");

// get user details from token
async function getMe(authorizationString) {
  // Removing the bearer prefix, leaving the clean token
  const token = authorizationString.substring("Bearer ".length);
  const userData = jwt.verify(token, config.secret);

  return userData;
}

module.exports = {
  getMe,
};
