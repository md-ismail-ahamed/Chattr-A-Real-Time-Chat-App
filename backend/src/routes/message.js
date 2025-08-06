const express=require('express');
const router = express.Router();
const {handleUsersForSideBar,getMessages,handleSendingMessages} = require("../controllers/message");
const {restrictedToLoginOnly} = require("../middlewares/auth");


router.get("/users",restrictedToLoginOnly,handleUsersForSideBar);
router.get("/:id",restrictedToLoginOnly,getMessages);
router.post("/send/:id",restrictedToLoginOnly,handleSendingMessages);

module.exports = router;