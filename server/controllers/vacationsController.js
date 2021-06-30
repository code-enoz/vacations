const vacationsLogic = require("../logic/vacationsLogic");
const express = require("express");
const router = express.Router();

router.post("/", async (request, response, next) => {
  let vacation = request.body;

  try {
    let newVacation = await vacationsLogic.addVacation(vacation);
    response.json(newVacation);
  } catch (error) {
    return next(error);
  }
});

router.post("/update", async (request, response, next) => {
  let details = request.body;

  try {
    await vacationsLogic.updateVacation(details);
    response.json();
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (request, response, next) => {
  const token = request.headers.authorization;

  try {
    let result = await vacationsLogic.getAll(token);

    response.json(result);
  } catch (e) {
    return next(e);
  }
});

router.get("/followed", async (request, response, next) => {
  try {
    let result = await vacationsLogic.getFollowedVacations();
    response.json(result);
  } catch (e) {
    return next(e);
  }
});

router.delete("/:id", async (request, response, next) => {
  const id = request.params.id;

  try {
    await vacationsLogic.deleteVacation(id);
    response.json();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
