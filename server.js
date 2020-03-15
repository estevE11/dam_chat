const express = require("express");
const socketio = require("socket.io");
const app = express();

const server = app.listen(3000);

const io = socketio(server);

let message_history = [];
let colors = [];

io.on("connection", function(socket) {
    io.to(socket.id).emit('msgh', message_history);

    socket.on("send_msg", function(data) {
        if(!colors[data.user]) {
            colors[data.user] = get_random_color();
        }
        data.color = colors[data.user];
        message_history.push(data);
        socket.broadcast.emit("receive_msg", data);
        io.to(socket.id).emit("msg_sent", data);
    });
});

const get_random_color = () => {
    const max = 200, min = 50;
    return {
        r: Math.floor(Math.random()*(max-min)+min),
        g: Math.floor(Math.random()*(max-min)+min),
        b: Math.floor(Math.random()*(max-min)+min)
    };
}