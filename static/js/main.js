let socket;

let username;

let last_msg;

function send() {
    let today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth()+1;
    const yy = today.getFullYear();
    let date = ((dd > 9 ? "" : "0") + dd) + '/'+ ((mm > 9 ? "" : "0") + mm) + "/" + yy;
    
    const hour = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();
    let time = ((hour > 9 ? "" : "0") + hour) + ':'+ ((min > 9 ? "" : "0") + min);

    let msg = {
        val: $("#inp_chat").val(),
        user: username,
        date: date,
        time: time
    }
    console.log(msg);
    $("#inp_chat").val("");
    socket.emit("send_msg", msg);
}


function addMessage(msg) {
    const colorString = "rgb(" + msg.color.r + ", " + msg.color.g +", " + msg.color.b + ")";
    let el = document.createElement("li");
    
    let m = "";
    
    const m_user = "<span id='msg_user' style='color:" + colorString +"'>" + msg.user + "</span>";
    const m_datetime = "<strong><span id='msg_datetime'>" + msg.date + " " + msg.time + "</span></strong>";

    if(last_msg) {
        if(last_msg.user === msg.user && last_msg.date === msg.date && last_msg.time === msg.time) {
            m = msg.val;
        } else {
            m = m_user + " " + m_datetime + "<br>" + msg.val
        }     
    }

    el.innerHTML = m;
    
    document.getElementById("chatbox").appendChild(el);
    $(".scroll").scrollTop($(".scroll")[0].scrollHeight);
    
    last_msg = msg;
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

    socket.on("msg_sent", function(data) {
        console.log("Messague succesfully sent");
        addMessage(data);
    });

    socket.on("receive_msg", function(data) {
        addMessage(data);
    });
}

window.onload = function() {
    const ip = window.prompt("IP:", "IP Adress");
    username = window.prompt("Username:", "");
    server_connect(ip, "80");
};