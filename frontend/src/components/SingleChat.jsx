import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./misc/ProfileModel";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import './styles.css';
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';
const ENDPOINT = `https://chat-app-2nq9.onrender.com`;
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain})=> {
    const {user, selectedChat, setSelectedChat, setNotification, notification } = ChatState(); 
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false); 
    const toast = useToast();
    const fetchMessages = async()=>{
        if(!selectedChat) return;
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
            };
            setLoading(true);
            const {data} = await axios.get(`https://chat-app-2nq9.onrender.com/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch(err) {
            toast({
                title: "Error occured",
                description: "Faild to load chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
    }
    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit("setup", user.user);
        socket.on("connected", ()=>setSocketConnected(true));
        socket.on("typing", ()=>setIsTyping(true));
        socket.on("stop typing", ()=>setIsTyping(false));
    }, [])
    useEffect(()=>{
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    console.log(notification+"---------");

    useEffect(()=>{
        socket.on('message received', (newMessageReceived)=>{
            if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id) {
                if(!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    })
    const sendMessageTo = async(e)=>{
        if(e.key==="Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                };
                setNewMessage("");
                const {data} = await axios.post(`https://chat-app-2nq9.onrender.com/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);
                console.log(data);
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch(err) {
                toast({
                    title: "Error occured",
                    description: "Failed to load chats",
                    status: "error",
                    isClosable: true,
                    duration: 5000,
                })
                return;
            }
        } 
    }
    const typingHandler = (e)=>{
        setNewMessage(e.target.value)
        if(!socketConnected) return;
        if(!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow-lastTypingTime;
            if(timeDiff>=timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
    return(
        <>
            {
                selectedChat?(
                    <>
                        <Text
                        fontSize={{base:"20px", md: "30px"}}
                        pb={3}
                        px={2}
                        w={"100%"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={{base: "space-between"}}
                        alignItems={"center"}
                        >
                            <IconButton
                                display={{base:"flex", md:"none"}}
                                icon={<ArrowBackIcon/>}
                                onClick={()=>setSelectedChat("")}
                            />
                            {!selectedChat.isGroupChat?(
                                <>
                                    {
                                        getSender(user.user, selectedChat.users)
                                    }
                                    <ProfileModal user={getSenderFull(user.user, selectedChat.users)}/>
                                </>
                            ):(
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            )}
                        </Text>
                        <Box
                        className="backgroundImageSetter"
                        display={"flex"}
                        justifyContent={"flex-end"}
                        flexDirection={"column"}
                        p={3}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                        >
                            {
                                loading? (
                                    <Spinner size={"xl"}
                                        w={20}
                                        h={20}
                                        alignSelf={"center"}
                                        margin={"auto"}
                                    />
                                ):(
                                        <div className="messages">
                                            <ScrollableChat messages={messages}/>
                                        </div>
                                    
                                )
                            }
                            
                            <FormControl onKeyDown={sendMessageTo} isRequired mt={3}>
                            {isTyping ? <Box >
                                <Text paddingLeft={"20px"} color={"white"}>Typing...</Text>
                            </Box>:(<></>)}
                                <Input
                                    bg={"#E0E0E0"}
                                    placeholder="message..."
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </FormControl>
                        </Box>
                    </>
                ):(
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}
export default SingleChat;