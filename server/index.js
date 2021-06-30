const pushController = require("./controllers/pushController");
const express = require("express");
const http = require("http");
// const socketIO = require("socket.io");

// const httpServer = http.createServer(server);
// const socketIO = require("socket.io");
// const socketServer = socketIO.listen(httpServer);

const followingController = require("./controllers/followingController");
const vacationsController = require("./controllers/vacationsController");
const usersController = require("./controllers/usersController");
const cors = require("cors");
const errorHandler = require("./errors/error-handler");

const loginFilter = require("./middleware/login-filter");

const server = express();
pushController(server);


server.use(cors({ origin: "http://localhost:3000", credentials: true }));

server.use(express.json());
server.use(loginFilter());
server.use("/following", followingController);
server.use("/vacations", vacationsController);
server.use("/users", usersController);

server.use(errorHandler);

server.listen(3001, () => console.log("Listening on http://localhost:3001"));