const usersCache = require("../dao/usersCache");

getUserDetails = (socket) => {
  console.log("!!!!!");

  let handshakeData = socket.request;
  let token = handshakeData._query["token"];
  console.log(token);
  let userDetails = usersCache.getDetails(token);
  console.log(userDetails);
  return userDetails.id;
};

pushController = (expressServer) => {
  const userIdToSocketsMap = require("../dao/socketIOCache");
  const http = require("http").createServer(expressServer);

  const socketIO = require("socket.io")(http);

  socketIO.sockets.on("connection", (socket) => {
    console.log("Connection request");
    let id = getUserDetails(socket);
    // its just map
    userIdToSocketsMap.set(id, socket);
    console.log(`user id ${id} connected to socket`);

    console.log("Total clients: " + userIdToSocketsMap.size);

    socket.on("add-new-vacation", (newVacation) => {
      socketIO.sockets.emit("add-new-vacation", newVacation);
    });

    socket.on("update-vacation", (vacation) => {
      socketIO.sockets.emit("update-vacation", vacation);
    });

    socket.on("delete-vacation", (vacation) => {
      socketIO.sockets.emit("delete-vacation", vacation);
    });

    socket.on("follow-vacation", (vacation) => {
      socket.broadcast.emit("follow-vacation", vacation);
    });

    socket.on("unfollow-vacation", (vacation) => {
      socket.broadcast.emit("unfollow-vacation", vacation);
    });



    socket.on("disconnect", () => {
      userIdToSocketsMap.delete(id);
      console.log(
        "user id" +
          id +
          " has been disconnected. Total clients: " +
          userIdToSocketsMap.size
      );
    });

  });

  http.listen(3002, () => console.log("Socket is listening on port 3002"));
};

module.exports = pushController;
