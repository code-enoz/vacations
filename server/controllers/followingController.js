const followingLogic = require("../logic/followingLogic");
const express = require("express");
const router = express.Router();

router.post("/:vacationId", async (request, response, next) => {
  let vacationId = request.params.vacationId;
  console.log(vacationId);

  let token = request.headers.authorization;

  try {
    await followingLogic.followVacation(token, vacationId);
    response.json();
  } catch (e) {
    return next(e);
  }
});

router.delete("/:vacationId", async (request, response, next) => {
  const token = request.headers.authorization;
  let vacationId = request.params.vacationId;

  try {
    await followingLogic.unfollowVacationForUser(token, vacationId);
    response.json();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
