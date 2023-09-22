const expressAsyncHandler = require("express-async-handler");
const Message = require('../models/messageModel');
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
exports.sendMessage = expressAsyncHandler(async(req, res)=>{
    const {chatId, content} = req.body;
    if(!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.user._id,
        content, 
        chat: chatId
    };
    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name picture");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: 'chat.users',
            select: "name picture email"
        });
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });
        res.json(message);
    } catch(err) {
        res.status(400);
        throw new Error(err.message);
    }
});

exports.allMessages = expressAsyncHandler(async(req, res)=>{
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate("sender", "name picture email").populate('chat');
        res.json(messages)
    } catch(err) {
        res.status(400);
        throw new Error(err.message);
    }
})