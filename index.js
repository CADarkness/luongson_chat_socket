const express = require('express');
const sharedsession = require("express-socket.io-session")
const OnlineUsers = require("./store/OnlineUsers")
const SendingChatUsers = require("./store/SendingChatUsers")
require("dotenv").config();
const port = process.env.PORT ?? 3001;
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const cors = require('cors');
app.use(cors());
const session = require("express-session")({
    secret: "keovip-chat-socket",
    resave: true,
    saveUninitialized: true
})
app.use(session)
const { Server } = require('socket.io');
const io = new Server(httpServer, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },
    maxHttpBufferSize: 1e8, // 100 MB,
    cors: {
        //origin: ['https://a2zchat.com'],
        origin: "*",
        methods: ['GET', 'POST']
    }
});
io.use(sharedsession(session), {
    autoSave: true
});

console.log(`26/10/2023`)

app.get("/ping", (req, res) => {
    console.log(`server is live`)
    res.status(200).json("server is live")
})

//handlers
const { userHandler } = require('./handlers/userHandler');
const { chatHandler } = require('./handlers/chatHandler');
const { roomHandler } = require('./handlers/roomHandler');
const RoomActiveUser = require('./store/RoomActiveUsers');
const notifyHandler = require('./handlers/notify.handler');

io.on('connection', (socket) => {

    if (socket.recovered) {
        console.log(`Socket ${socket.id} was recovered`)
        const foundedUser = OnlineUsers.list.find(user => user.socketId === socket.id)
        if (foundedUser) {
            socket.emit("reconnect", "Đã kết nối lại")
            socket.join(foundedUser.userId)
        }
    }

    userHandler(io, socket)
    roomHandler(io, socket)
    chatHandler(io, socket)
    notifyHandler(io, socket)

    socket.on("ping", ({ userId }) => {
        io.to(userId).emit("receive_ping", "receive_ping")
    })

    socket.on('disconnect', () => {
        const user = OnlineUsers.eject({ socketId: socket.id })
        if (user) {
            socket.leave(user.userId)
        }
        SendingChatUsers.eject({ socketId: socket.id })
        RoomActiveUser.eject({ socketId: socket.id })
        socket.disconnect();
    });
});

httpServer.listen(port, () => {
    console.log('Server listening on port ' + port);
});