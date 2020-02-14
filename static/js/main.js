console.log("cacacaca");

let socket;

function send() {
    let today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth()+1;
    const yy = today.getFullYear();
    let date = ((dd > 9 ? "" : "0") + dd) + '/'+ ((mm > 9 ? "" : "0") + mm) + "/" + yy;
    
    let msg = {
        val: $("#inp_chat").val(),
        user: $("#inp_username").val(),
        date: date,
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    }
    console.log(msg);
    socket.emit("send_msg", msg);
    addMessage(msg);
}


function addMessage(msg) {
    let el = document.createElement("li");
    el.innerHTML = "<strong>" + msg.date + " " + msg.time + " " + msg.user + ": <strong>" + msg.val;
    document.getElementById("chatbox").appendChild(el);
}

function server_connect(ip, port) {
    const full_ip = ip + ":" + port;
    socket = io.connect(full_ip);
    socket.on("connect", function() {
        console.log("Connected to  " + full_ip);
        con_id = socket.id;
    });

    socket.on("msgh", function(data) {
        console.log("Got msgs");
        data.forEach(element => {
            addMessage(element);
        });
    });

    socket.on("receive_msg", function(data) {
        addMessage(data);
    });
}

window.onload = function() {
    server_connect(window.prompt("IP:", "??.???.???.???"), "3000");
};