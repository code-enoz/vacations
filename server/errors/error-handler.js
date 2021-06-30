// we connect this file into index.js

let errorHandler = (e, request, response, next) => {
  // e = my Server error --> IT HAS AN ENUM INSIDE (!!) called errorType
  if (e.errorType !== undefined) {
    if (e.errorType.isShowStackTrace) {
      console.error(e);
    }

    response.status(e.errorType.httpCode).json({ error: e.errorType.message });
    return;
  }
  console.log(e);
  response.status(700).json({ error: "General error" });
};

module.exports = errorHandler;
