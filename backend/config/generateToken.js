const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const generateToken = asyncHandler(async (id)=>{
    console.log("id", id);
    const token = await jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
    console.log(token);
    return token;
});
module.exports = generateToken;