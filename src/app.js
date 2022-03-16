
const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
})

const users = [];
const activeUsers = new Set();

io.on("connection", (socket) => {


    console.log('first connection handshake', socket.handshake.query.fname);
    socket.emit("myId", socket.id)

    let name = socket.handshake.query.fname;

    socket.on("new user", function (data) {
        socket.userId = data;
        activeUsers.add(data);
        io.emit("new user", [...activeUsers]);
        console.log(activeUsers);
    });

    socket.on("disconnect", () => {
        var clientid = socket.id;

        for (var i = 0; i < users.length; i++) {
            if (users[i].id && users[i].id == clientid) {
                users.splice(i, 1);
                break;
            }
        }

        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);

    })

    users.push({
        id: socket.id,
        name: name
    });



})

server.listen(7000, () => console.log("server is running on port 7000"))