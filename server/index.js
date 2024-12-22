const express = require("express");
const app = express();
const port = 9000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// app.use(express.static(path.join(__dirname, '/public/static')));

app.get("/", (req, res) => {
  res.send("hello world");
});

io.on("connection", (socket) => {
  socket.on("message", ({ data, room }) => {
    // console.log('message: ' + msg);
    // io.emit('message', msg);
    // console.log("from server" , msg);
    console.log("from server", data, room);
    io.to(room).emit("privateMessage", data);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(socket.id, "joined room", room);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(socket.id, "left room", room);
  });

  socket.on("roomMessage", ({ data, rooms }) => {
    console.log("from server", data, rooms);
    // io.to(room).emit('privateMessage', data);
    io.to(rooms).emit("privateMessage", data);
  });
});

server.listen(port, () => console.log(`listening on port ${port}`));
