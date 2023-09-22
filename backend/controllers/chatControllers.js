const expressAsyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require("../models/userModel");

exports.accessChat = expressAsyncHandler(async(req, res)=>{
    const {userId} = req.body;
    if(!userId) {
        console.log("request ID does not exist");
        return res.status(400).json({
            message: "user id not passed"
        });
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch : {$eq:req.user.id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ],
    })
    .populate('users', '-password')
    .populate("latestMessage");
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender', 
        select: "name picture email"
    });
    if(isChat.length>0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };
        try{
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users", '-password');
            res.status(200).send(FullChat);
        } catch(err) {
            res.status(400);
        }
    }
});

exports.fetchChats = expressAsyncHandler(async(req, res)=>{
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user.id}}})
        .populate("users", '-password')
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async (results)=>{
            const result = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name picture email",
            });
            res.status(200).json({
                success: true,
                result
            });
        })
    }catch(err) {
        res.status(400).send(err.message);
    }
})

exports.createGroupChat = expressAsyncHandler(async(req, res)=>{
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({
            message: "Please fill all the fields"
        });
    }
    console.log("HELLo");
    var users = JSON.parse(req.body.users);
    if(users.length<2) {
        return res.status(400).send("More than 2 users required to form a group")
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users,
            groupAdmin: req.user._id
        });
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
                                        .populate("users", "-password")
                                        .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch(err) {
        res.status(400).send(err.message);
    }
})

exports.renameGroup = expressAsyncHandler(async(req, res)=>{
    const {chatId, chatName} = req.body;
    const data = await Chat.findByIdAndUpdate(chatId, {
        chatName
    }, {
        new: true
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
    if(!data) {
        res.status(404).send({
            message: "No chat found"
        })
    } else {
        res.status(200).send(data);
    }
})

exports.removeGroup = expressAsyncHandler(async(req, res)=>{
    const {chatId, userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull:{users: userId},
    },        
    {new: true})
    .populate("users", '-password')
    .populate("groupAdmin", "-password");
    if(!removed) {
        res.status(404).send("something went wrong");
    } else {
        res.status(200).send(removed);
    }
})

exports.addToGroup = expressAsyncHandler(async(req, res)=>{
    const {chatId, userId} = req.body;
    console.log("HELLO", chatId, userId);
    const added = await Chat.findByIdAndUpdate(chatId, {
        $push:{users: userId},
    },        
    {new: true})
    .populate("users", '-password')
    .populate("groupAdmin", "-password");
    if(!added) {
        res.status(404).send("something went wrong");
    } else {
        res.status(200).send(added);
    }
})