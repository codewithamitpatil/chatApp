const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    }
})

const users = [];
const activeUsers = new Set();
let count = 0;

let roomId = "amit";

io.on("connection", (socket) => {

    count++;
    console.log('first connection handshake', socket.handshake.query.fname);
    socket.emit("myId", socket.id)

    socket.on("disconnect", () => {
        count--;

    })

    socket.on("callUser", (data) => {
        console.log(data);
        socket.to(data.to).emit('reciveCall', data);
    });

    socket.on('callAccept', (data) => {
        console.log(data);
        socket.to(data.to).emit('callAccept', data);
    });

    socket.on('callEnd', (data) => {
        socket.to(data.to).emit('callEnd', data);
    });

})

server.listen(7000, () => console.log("server is running on port 7000"))