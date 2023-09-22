require('dotenv').config();
const connectDB = require('./config/db');
connectDB();
const express = require('express');
const app = express();
const {chats} = require('./data/data');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler, notfound } = require('./middleware/ErrorMiddleware');
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Api is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notfound);
app.use(errorHandler);

const PORT = process.env.PORT;
const server = app.listen(PORT, ()=>{
    console.log(`Running on 5000`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: true,
        credentials: true,
    },
    allowEIO3: true,
});

io.on("connection", (socket)=>{
    console.log("Connected to socket.io");
    socket.on('setup', (userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("User joined room : "+ room);
    });
    socket.on("new message", (newMessageReceived)=>{
        var chat = newMessageReceived.chat;
        if(!chat.users) return console.log("chat.users is not defined");
        chat.users.forEach((user)=>{
            if(user._id==newMessageReceived.sender._id)return;
            socket.in(user._id).emit("message received", newMessageReceived);
        })
    });
    socket.on("typing", (room)=>{
        return socket.in(room).emit("typing");
    });
    socket.on('stop typing', (room)=>{
        return socket.in(room).emit('stop typing')
    });
    socket.off("setup", (userData)=>{
        console.log("User disconnected");
        socket.leave(userData._id);
    })
});