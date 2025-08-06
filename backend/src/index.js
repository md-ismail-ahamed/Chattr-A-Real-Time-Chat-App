const express = require('express');
const dotenv = require('dotenv');
const {connectMongoDb} = require("./lib/db");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {app,server} =require("./lib/socket");
const path = require('path');
dotenv.config();    

const port = process.env.PORT || 3001;

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(cookieParser());

connectMongoDb().then(() => console.log("MongoDB connected!!"));

const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");

app.use(express.static('public'));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));



app.use("/user", userRoute);
app.use("/message", messageRoute);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/^(?!\/user|\/message).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(port, () =>{
    console.log("server running at port 3001");
});