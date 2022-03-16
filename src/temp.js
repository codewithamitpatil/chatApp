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

const connectedClients = [];

io.on("connection", (socket) => {



    console.log('connection zal', socket.id)

    socket.emit("me", socket.id)

    socket.on('startConnection', (name, socketId) => {

        connectedClients.push({
            socketId: socketId,
            name: name
        });
        console.log('connected clients /////////////');
        console.log(connectedClients)

        socket.emit('ConnectedClients', connectedClients);
        socket.broadcast.emit('ConnectedClients', connectedClients);

    });


    socket.on('sendM1', ({
        userToCall,
        signalData,
        from
    }) => {
        console.log('sendm1//////{{{{', message, toId)
        socket.to(from).emit('reciveM1', {
            userToCall,
            signalData,
            from
        });
    });


    socket.on("disconnect", (socketId) => {
        console.log('disconnnect calleddddddddd');
        const id = connectedClients.findIndex((item) => item.socketId == socketId);
        connectedClients.splice(id, 1);
        //  socket.broadcast.emit("callEnded");
    })

    socket.on('chatUser', data => {
        console.log(data);
    });

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name
        })