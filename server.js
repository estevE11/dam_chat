const express = require("express");
const socketio = require("socket.io");
const app = express();

const server = app.listen(3000);

const io = socketio(server);

let message_history = [];

io.on("connection", function(socket) {
    io.to(socket.id).emit('msgh', message_history);

    socket.on("send_msg", function(data) {
        message_history.push(data);
        socket.broadcast.emit("receive_msg", data);
    });
});