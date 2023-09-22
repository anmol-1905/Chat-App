const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async(req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // console.log(token);
            const decode =  await jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decode);
            req.user = await User.findById(decode.id);
            // console.log("helo", req.user);
            next();
        }catch(err) {
            res.status(401).json({
                success: false,
                message: "Authorization failed"
            })
        }
    } else {
        res.status(401).json({
            success: false,
            message: "Not authorized, no token"
        })
    }
});
