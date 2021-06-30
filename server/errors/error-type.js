

let ErrorType = {
  GENERAL_ERROR: {
    id: 1,
    httpCode: 600,
    message:
      "A big fuck up which we'll never tell you of had just happend. And now : A big fat lie....'A general error ....'",
    isShowStackTrace: true,
  },
  USER_NAME_ALREADY_EXIST: {
    id: 2,
    httpCode: 601,
    message: "User name already exist",
    isShowStackTrace: false,
  },
  UNAUTHORIZED: {
    id: 3,
    httpCode: 401,
    message: "Login failed, invalid user name or password",
    isShowStackTrace: false,
  },

 
  NO_VACATIONS_IN_DB: {
    id: 4,
    httpCode: 601,
    message: "No vacations in data base",
    isShowStackTrace: true,
  },
  NO_FOLLOWED_VACATIONS_IN_DB: {
    id: 5,
    httpCode: 601,
    message: "Non of the vacations been followed",
    isShowStackTrace: false,
  },
  INVALID_INPUT: {
    id: 5,
    httpCode: 400,
    message: "Invalid input",
    isShowStackTrace: false,
  },
};

module.exports = ErrorType;
