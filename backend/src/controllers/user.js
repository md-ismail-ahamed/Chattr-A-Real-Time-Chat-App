const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const {getToken} = require("../lib/auth");
const cloudinary = require('../lib/cloudinary');

const saltRounds = 10;

async function handleSignUpUser (req,res) {
    const {fullName,email,password } = req.body;
    const user = await User.findOne({email});
    if(password.length < 6) return res.status(400).json("password must be at least 6 characters");
    if(user) return res.status(400).json("user already exists");
    const hashedPassword = await bcrypt.hash(password,saltRounds);
   const newUser =  await User.create({
        fullName,
        email,
        password: hashedPassword,
    });
    if(newUser) {
        const token = getToken(newUser);
        res.cookie("token",token);
    }
    
    return res.status(201).json("user created");
}

async function handleSignInUser (req,res) {
    const {email,password } = req.body;
    const user = await User.findOne({email});
    
    if(!user) return res.status(400).json("user does not exist");
    
    const isPasswordValid = await bcrypt.compare(password,user.password);
    
    if(!isPasswordValid) return res.status(400).json("invalid password");
    
    const token = getToken(user);
    res.cookie("token",token);
    return res.status(201).json("user signed in");
}

async function handleSignOutUser (req,res) {
    try{
     res.clearCookie("token");
     return res.status(201).json("Signed Out Successfully");
    }
    catch(err){
        res.status(500).json("signout error");
    }
}
async function handleUpdateProfile(req,res) {
    try {
    const {profilePic} = req.body;

    const userId = req.user._id;

    if(!profilePic) return res.status(400).json("profile pic is required");

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new: true});
    
    res.status(200).json(updatedUser);
    }catch(err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
}

async function checkAuth(req,res) {
    try {
        res.json(req.user);
    }catch(err) {
        console.log("Error in checkAuth",err.message);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = {
    handleSignUpUser,
    handleSignInUser,
    handleSignOutUser,
    handleUpdateProfile,
    checkAuth,
};