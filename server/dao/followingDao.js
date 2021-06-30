const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
let ServerError = require("../errors/server-error");
const usersCache = require("../dao/usersCache");

async function followVacation(userId, vacationId) {
  let sql =
    "INSERT INTO vacation_followers (`user_id`, `vacation_id`) VALUES(?,?)";
  let parameters = [userId, vacationId];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    // throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    console.log(e);
  }
}

async function unfollowVacationForUser(userId, vacationId) {
  let sql = "DELETE FROM vacation_followers WHERE user_id=? AND vacation_id=?";
  let parameters = [userId, vacationId];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    // throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    console.log(e);
  }
}

function getUserDetails(token) {
  return usersCache.getDetails(token);
}

module.exports = {
  followVacation,
  unfollowVacationForUser,
  getUserDetails,
};
