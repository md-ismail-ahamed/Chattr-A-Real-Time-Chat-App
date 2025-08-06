const express = require('express');
const{} = require("../controllers/user");
const {
    handleSignUpUser,
    handleSignInUser,
    handleSignOutUser,
    handleUpdateProfile,
    checkAuth
} = require('../controllers/user');

const { restrictedToLoginOnly } = require('../middlewares/auth');

const router = express.Router();

router.post("/signup",handleSignUpUser);
router.post("/signin",handleSignInUser);
router.post("/signout",handleSignOutUser);
router.put("/update-profile",restrictedToLoginOnly,handleUpdateProfile);
router.get("/check",restrictedToLoginOnly,checkAuth);

module.exports = router;
