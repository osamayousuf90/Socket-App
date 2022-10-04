const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io")
const cors = require("cors")
const server = http.createServer(app)


app.use(cors())


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods : [ "GET" , "POST" ],
  },
})


io.on("connection", (socket) => {

  socket.on("join_room", (room) => {
    socket.join(room)
  })

  socket.on("send-message", (data) => {
    socket.to(data.room).emit("received-message", data)
  })


  socket.on('new-user', name =>
  {
      io.emit('user-connected', name)
  })


})


server.listen("3001", () => {
  console.log("Server listening on 3001");
})