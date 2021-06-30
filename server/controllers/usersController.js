const usersLogic = require("../logic/usersLogic");
const express = require("express");
// const authLogic = require("../logic/authLogic")

const router = express.Router();

router.delete("/logout", async (request, response, next) => {
  let token = request.headers.authorization;

  try {
    await usersLogic.logout(token);
    response.json();
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (request, response, next) => {
  let user = request.body;

  try {
    let data = await usersLogic.addUser(user);
    response.json(data);
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (request, response, next) => {
  let loginDetails = request.body;

  try {
    let successfulLoginResponse = await usersLogic.login(loginDetails);
    response.json(successfulLoginResponse);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
