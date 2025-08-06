const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io")

const server = http.createServer(app);

const io = new Server(server,{
    cors:{ 
        origin: ["http://localhost:5173"]
    }
});

//Its is a map that is used to store the online users with their userIds with socketId
const usersSocketMap = {}; // {userId:socketId}

const getReceiverSocketId = (userId) => {
    return usersSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("User connected",socket.id);
    const userId = socket.handshake.query.userId;
    if(userId)
        usersSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(usersSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected",socket.id);
        delete usersSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(usersSocketMap));
    });

});

module.exports = {
    io,
    app,
    server,
    getReceiverSocketId

};