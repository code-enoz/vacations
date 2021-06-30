let vacationsDao = require("../dao/vacationsDao");
let ServerError = require("../errors/server-error");
let ErrorType = require("../errors/error-type");

async function addVacation(vacation) {
  // Validations
  // for getVacations > isVacationsEmpty

  let result = await vacationsDao.addVacation(vacation);
  return result;
}

async function deleteVacation(vacationId) {
  await vacationsDao.deleteVacation(vacationId);
}

async function updateVacation(vacation) {
  await vacationsDao.updateVacation(vacation);
}

async function getAll(token) {
  let newToken = token.split(" ").pop();

  let { id } = vacationsDao.getUserDetails(newToken);

  let vacations = await vacationsDao.getAll(id);

  for (let vacation of vacations) {
    if (vacation.userId == id) {
      vacation.isFollowed = true;
    }
    // if no return inside if then must else
    else {
      vacation.isFollowed = false;
    }
  }
  return vacations;
}

async function getFollowedVacations() {
  let vacations = await vacationsDao.getFollowedVacations();

  return vacations;
}

module.exports = {
  addVacation,
  updateVacation,
  getAll,
  deleteVacation,
  getFollowedVacations,
};
