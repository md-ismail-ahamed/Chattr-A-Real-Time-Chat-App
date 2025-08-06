const express = require('express');
const Message = require("../models/message");
const User = require("../models/user");
const cloudinary = require('../lib/cloudinary');
const { io, getReceiverSocketId } = require("../lib/socket");
const { get } = require('mongoose');

async function handleUsersForSideBar(req,res) {
    try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getMessages(req,res) {
    try {
        const myId = req.user._id;
        const receiverId = req.params.id;
        const messages = await Message.find({
            $or: [
                {senderId: myId,receiverId: receiverId},
                {senderId: receiverId,receiverId: myId}
            ]
        });
        res.status(200).send(messages);
    } catch (error) {
        
    }
}
async function handleSendingMessages(req,res) {
    try {
        const {text,image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

         //In further we implement the realtime chat messaging using socket.io in this handler function
         
       const receiverSocketId = getReceiverSocketId(receiverId);
       const senderSocketId = getReceiverSocketId(senderId);

       if(receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage",newMessage);
       }

       if(senderSocketId) {
        io.to(senderSocketId).emit("newMessage",newMessage);
       }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error,{message:"error in sending message"});
        res.status(500).json("Internal Server Error");
    }
}

module.exports = {
    handleUsersForSideBar,
    getMessages,
    handleSendingMessages
}
