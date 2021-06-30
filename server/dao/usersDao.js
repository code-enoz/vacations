const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
let ServerError = require("../errors/server-error");
const usersCache = require("../dao/usersCache");

function setCache(token, userDetails) {
  usersCache.setUserCache(token, userDetails);
  console.log(usersCache);
}

function deleteFromCache(token) {
  usersCache.deleteUserFromCache(token);
}

async function addUser(user) {
  let sql =
    "INSERT INTO users (first_name, family_name, username, password) values(?,?,?,?)";
  let parameters = [
    user.firstName,
    user.familyName,
    user.username,
    user.password,
  ];
  try {
    let response = await connection.executeWithParameters(sql, parameters);
    let successfulRegisterDetails = {
      id: response.insertId,
      name: user.firstName,
      familyName: user.familyName,
      username: user.username,
      password: user.password,
      type: "client",
    };
    return successfulRegisterDetails;
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function isUserExistByName(username) {
  let sql = `SELECT * FROM users WHERE username = ?`;
  let parameters = [username];

  try {
    let response = await connection.executeWithParameters(sql, parameters);
    if (response == null || response.length == 0) {
      return false;
    }
    return true;
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function login(loginDetails) {
  console.log(loginDetails);
  let sql =
    "SELECT id, first_name AS firstName, family_name AS familyName , username, type  FROM users u WHERE u.username = ? AND u.password = ?";
  let parameters = [loginDetails.username, loginDetails.password];
  let response;
  try {
    response = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
  if (response == null || response.length == 0) {
    throw new ServerError(ErrorType.UNAUTHORIZED);
  }

  return response[0];
}

async function updateUser(user) {
  // הסדר בפרמטרים של 2 השורות הבאות חייב להיות זהה
  let sql =
    "UPDATE users SET first_name = ?, family_name = ? , username = ?, password = ? where id=? ";
  let parameters = [
    user.firstName,
    user.family_name,
    user.username,
    user.password,
    user.id,
  ];
  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function deleteUser(id) {
  let sql = "DELETE FROM users WHERE id = ?";
  let parameters = [id];
  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

module.exports = {
  addUser,
  isUserExistByName,
  login,
  updateUser,
  deleteUser,
  setCache,
  deleteFromCache,
};
