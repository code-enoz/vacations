// logic -> for the validation parts
let usersDao = require("../dao/usersDao");
let ServerError = require("../errors/server-error");
let ErrorType = require("../errors/error-type");
// crypt for user password
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config.json");

const saltRight = "sdkjfhdskajh";
const saltLeft = "--mnlcfs;@!$ ";

function logout(token) {
  let newToken = token.split(" ").pop();
  usersDao.deleteFromCache(newToken);
}

function hashPassword(password) {
  return crypto
    .createHash("md5")
    .update(saltLeft + password + saltRight)
    .digest("hex");
}

function generateToken(username) {
  return jwt.sign({ sub: username }, config.secret);
}

function createSuccessfulLoginResponse(token, userData) {
  return {
    authToken: token,
    userType: userData.type,
    firstName: userData.firstName,
  };
}

function inputValidations(user) {
  if (
    user.firstName.trim() == "" ||
    user.familyName.trim() == "" ||
    user.username.trim() == "" ||
    user.password.trim() == ""
  ) {
    ErrorType.INVALID_INPUT.message = "All fields must be fill correctly.";
    throw new ServerError(ErrorType.INVALID_INPUT);
  }

  if (
    user.firstName.length < 2 ||
    user.familyName.length < 2 ||
    user.username.length < 2 ||
    user.password.length < 2
  ) {
    ErrorType.INVALID_INPUT.message =
      "All fields must contain at least 3 characters.";
    throw new ServerError(ErrorType.INVALID_INPUT);
  }

  if (
    user.firstName.length > 20 ||
    user.familyName.length > 20 ||
    user.username.length > 20 ||
    user.password.length > 20
  ) {
    ErrorType.INVALID_INPUT.message =
      "All fields must contain at most 20 characters.";
    throw new ServerError(ErrorType.INVALID_INPUT);
  }
}

async function addUser(user) {
  // Validations
  // TEST FOR ERRORS:
  inputValidations(user);

  if (await usersDao.isUserExistByName(user.username)) {
    throw new ServerError(ErrorType.USER_NAME_ALREADY_EXIST);
  }

  user.password = hashPassword(user.password);
  console.log("Hashed password : " + user.password);
  let registerDetails = await usersDao.addUser(user);
  let token = generateToken(user.username);
  usersDao.setCache(token, registerDetails);
  let successfulLoginResponse = createSuccessfulLoginResponse(
    token,
    registerDetails
  );
  return successfulLoginResponse;
}

async function login(loginDetails) {
  // inputValidations(loginDetails)

  if (
    loginDetails.username.trim() == "" ||
    loginDetails.password.trim() == ""
  ) {
    ErrorType.INVALID_INPUT.message = "All fields must be fill correctly.";
    throw new ServerError(ErrorType.INVALID_INPUT);
  }
  loginDetails.password = hashPassword(loginDetails.password);
  let userLoginData = await usersDao.login(loginDetails);
  let token = generateToken(loginDetails.username);
  usersDao.setCache(token, userLoginData);
  let successfulLoginResponse = createSuccessfulLoginResponse(
    token,
    userLoginData
  );
  console.log(userLoginData);
  return successfulLoginResponse;
}

async function updateUser(user) {
  // Validations
  await usersDao.updateUser(user);
  console.log(user);
}

async function deleteUser(id) {
  await usersDao.deleteUser(id);
}

module.exports = {
  addUser,
  login,
  updateUser,
  deleteUser,
  logout,
};
