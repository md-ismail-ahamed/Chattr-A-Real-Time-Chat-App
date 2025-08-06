const dotenv = require("dotenv").config();
const mongoose = require('mongoose');

function connectMongoDb() {
    return mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));
} 

module.exports = {
    connectMongoDb
} 