let followingDao = require("../dao/followingDao");
let ServerError = require("../errors/server-error");
let ErrorType = require("../errors/error-type");

async function followVacation(token, vacationId) {
  let newToken = token.split(" ").pop();

  let { id } = followingDao.getUserDetails(newToken);
  await followingDao.followVacation(id, vacationId);
}

async function unfollowVacationForUser(token, vacationId) {
  let newToken = token.split(" ").pop();
  // token is still o.k. at that point idk if format is ok, should be.

  let { id } = followingDao.getUserDetails(newToken);

  console.log(id);
  console.log(vacationId);
  await followingDao.unfollowVacationForUser(id, vacationId);
}

module.exports = {
  followVacation,
  unfollowVacationForUser,
};
