const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.broadcast.emit("uptade", username + " entrou no grupo");
  });
  socket.on("exituser", function (username) {
    socket.broadcast.emit("uptade", username + " deixou o grupo");
  });
  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });
});

server.listen(3000)
console.log(`http://localhost:3000`)
