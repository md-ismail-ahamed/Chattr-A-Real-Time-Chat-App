const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


function getToken(user) {
    try {
    const token = jwt.sign({
        id: user._id,
        fullName: user.fullName,
        email: user.email
    },process.env.JWT_SECRET);
    return token;
}catch(err) {
    console.log("Null");
}
}

function verifyToken(token) {
    try {
        return jwt.verify(token,process.env.JWT_SECRET);
    }catch(err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    getToken,
    verifyToken,
}
