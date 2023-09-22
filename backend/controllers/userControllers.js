const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

exports.registerUser = asyncHandler(async (req, res)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        res.status(400).json({
            success: false,
            message: "Data insufficient"
        });
    }
    const userExists = await User.findOne({email});
    if(userExists) {
        res.status(400).json({
            success: false,
            message: "User already exists"
        })
    }
    const picture = (req.body.picture===undefined || req.body.picture.length===0) ? 
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        : req.body.picture;
    const user = await User.create({
        name, 
        email,
        password,
        picture
    });
    user.password = undefined;
    const token = await generateToken(user.id);
    if(user) {
        res.status(200).json({
            success: true,
            token,
            user
        });
    } else {
        res.status(400).json({
            success: false,
            message: "failed to create user"
        });
    }
});

exports.login = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        });
    }
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))) {
        const token =  await generateToken(user.id);
        res.status(200).json({
            success: true,
            token,
            user
        });
    } else {
        res.status(400).json({
            success: false,
            message: "email or password do not match"
        })
    }
});

exports.getrAllUsers = asyncHandler(async(req, res)=>{
   const keyword = req.query.search ? {
    $or: [
        { name: { $regex: new RegExp(`^${req.query.search}`, 'i') } },
        { email: { $regex: new RegExp(`^${req.query.search}`, 'i') } }
    ]
    } : {};
    const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
    res.send(users);
})