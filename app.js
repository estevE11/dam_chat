const express = require("express");
const socketio = require("socket.io");
const app = express();
const path = require("path");
const url = require("url");

const PORT = 80;

const server = app.listen(PORT, function() {
    console.log("Listening to " + PORT);
});

const io = socketio(server);

let message_history = [];
let colors = [];

app.engine('pug', require('pug').__express)
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static")));

app.get("/", function(req, res) {
    console.log(req.url);
    let p = path.join(req.url, "index");
    res.render(p.substring(1, p.length), url.parse(req.url, true));
});

io.on("connection", function(socket) {
    io.set('transports', ['websocket']);
    console.log("caca");
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
