const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
const {verifyToken} = require('../lib/auth');
dotenv.config();
async function restrictedToLoginOnly(req,res,next) {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json("Unauthorized");

        const verify = verifyToken(token);

        if(!verify) return res.status(401).json("Unauthorized");

        const user = await User.findById(verify.id);

        if(!user) return res.status(401).json("Unauthorized");

        req.user = user;
        next();
    }catch(err) {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

module.exports = {
    restrictedToLoginOnly,
}