const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  const userId = socket.id;
  console.log("connected user: ", userId);
  socket.emit("user-connected", userId);
  socket.on("set-users", (userName) => {
    console.log("user data:", userName);
    io.emit("user-name", { userName, userId });
  });
  socket.on("message", (data) => {
    console.log("Received data is: ", data);
    socket.broadcast.emit("receive-message", data);
  });
  socket.on("typing", (user) => {
    console.log("user typing is ", user);
    socket.broadcast.emit("user-typing", user);
  });
  socket.on("not-typing", () => {
    socket.broadcast.emit("user-not-typing");
  });
});

httpServer.listen(8080, () => {
  console.log("listening on *:8080");
});
