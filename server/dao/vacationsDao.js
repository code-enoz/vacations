const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
let ServerError = require("../errors/server-error");
const usersCache = require("../dao/usersCache");

async function addVacation(vacation) {
  let sql =
    "INSERT INTO vacations (description, destination, image_url , departure_date, return_date, price) values(?,?,?,?,?,?)";
  let parameters = [
    vacation.description,
    vacation.destination,
    vacation.imageUrl,
    vacation.departureDate,
    vacation.returnDate,
    vacation.price,
  ];

  try {
    let response = await connection.executeWithParameters(sql, parameters);
    let newVacation = {
      id: response.insertId,
      description: vacation.description,
      destination: vacation.destination,
      imageUrl: vacation.imageUrl,
      departureDate: vacation.departureDate,
      returnDate: vacation.returnDate,
      price: vacation.price,
    };
    return newVacation;
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function deleteVacation(vacationId) {
  let sql = "DELETE FROM vacations WHERE id=?";
  let parameters = [vacationId];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    // throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    console.log(e);
  }
}

async function updateVacation(vacation) {
  // CHANGE PARAMS!!!
  let sql =
    "UPDATE vacations SET description = ?, destination = ? , image_url = ?, departure_date = ?, return_date = ?, price = ? where id=? ";
  let parameters = [
    vacation.description,
    vacation.destination,
    vacation.imageUrl,
    vacation.departureDate,
    vacation.returnDate,
    vacation.price,
    vacation.id,
  ];
  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function getAll(userId) {
  let sql = `
    SELECT v.id, v.description, v.destination, v.image_url AS imageUrl , DATE_FORMAT(v.departure_date , '%d/%m/%Y') AS departureDate, DATE_FORMAT(v.return_date , '%d/%m/%Y') AS returnDate, v.price, vf.user_id AS userId,
    (
           SELECT  COUNT(*) 
           FROM vacation_followers
           WHERE vacation_id = v.id
       )  AS followersAmount 
       FROM vacations v
       left join vacation_followers vf 
       ON v.id = vf.vacation_id AND vf.user_id = ?
        ;
`;
  let parameters = [userId];
  try {
    let vacations = await connection.executeWithParameters(sql, parameters);

    if (vacations == null || vacations.length == 0) {
      throw new ServerError(ErrorType.NO_VACATIONS_IN_DB);
    }
    return vacations;
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function getFollowedVacations() {
  let sql = ` SELECT DISTINCT v.destination, (
        SELECT COUNT(*)
        FROM vacation_followers
        WHERE vacation_id = v.id
    ) AS followersAmount FROM vacations v JOIN vacation_followers vf ON v.id = vf.vacation_id
  WHERE v.id = vf.vacation_id;`;

  try {
    let vacations = await connection.execute(sql);
    if (vacations == null || vacations.length == 0) {
      throw new ServerError(ErrorType.NO_VACATIONS_IN_DB);
    }
    return vacations;
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

function getUserDetails(token) {
  return usersCache.getDetails(token);
}

module.exports = {
  addVacation,
  getAll,
  updateVacation,
  getUserDetails,
  deleteVacation,
  getFollowedVacations,
};
