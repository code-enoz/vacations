const usersCache = new Map();

function setUserCache(token, userDetails) {
  usersCache.set(token, userDetails);
  console.log(usersCache);
}

function deleteUserFromCache(token) {
  usersCache.delete(token);
}

function getDetails(token) {
  console.log(usersCache);

  return usersCache.get(token);
}

module.exports = {
  usersCache,
  setUserCache,
  deleteUserFromCache,
  getDetails,
};
