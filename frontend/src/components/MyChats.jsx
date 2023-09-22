import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Button, Stack, useToast , Text, Image} from "@chakra-ui/react";
import {AddIcon} from '@chakra-ui/icons';
import ChatLoading from "./ChatLoading";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import GroupChatModel from '../components/misc/GroupChatModel';
import './styles.css';
function MyChats({fetchAgain}) {
    const [loggedUser, setLoggedUser] = useState();
    const {selectedChat, setSelectedChat, user, chats, setChats} = ChatState();
    const toast = useToast();
    const fetchChats = async() =>{
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.get(`${process.env.BACKEND_API_ENDPOINT}/api/chat`, config);
            setChats(data.result);
        }catch(err){
            toast({
                title: "Error Occured",
                description: "Failed to load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
    }
    useEffect(()=>{
        const res = JSON.parse(localStorage.getItem("userInfo"));
        setLoggedUser(res.user);
        fetchChats();
    },[fetchAgain]);
    return (
        <>
            <Box
            display={{base: selectedChat ? "none": "flex", md: "flex"}}
            flexDir="column"
            alignItems="center"
            p={3}
            bg={"white"}
            w={{base:"100%", md:"31%"}}
            borderRadius={"lg"}
            borderWidth={"1px"}>
                <Box
                pb={3}
                px={3}
                fontSize={{base:"18px", md:"18px"}}
                fontFamily={"Work sans"}
                display={"flex"}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}>
                    My Chats
                    <GroupChatModel>
                        <Button
                        d="flex"
                        fontSize={{base:"15px", md:"10px", lg:"15px"}}
                        rightIcon={<AddIcon />}>
                            New Group Chat
                        </Button>
                    </GroupChatModel>

                </Box>
                <Box
                d="flex"
                flexDir={"column"}
                p={3}
                bg={"#F8F8F8"}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"scroll"}>
                    {chats?(
                        <Stack>
                            {
                                chats.map((chat)=>(
                                    <Box
                                    onClick={()=>setSelectedChat(chat)}
                                    cursor={"pointer"}
                                    bg={selectedChat===chat?"#38B2Ac":"#E8E8E8"}
                                    color={selectedChat===chat?"white":"black"}
                                    px={3}
                                    py={2}
                                    borderRadius={"lg"}
                                    key={chat._id}
                                    >
                                        
                                        <Text>
                                            {!chat.isGroupChat?(
                                                getSender(loggedUser, chat.users)
                                            ):(chat.chatName)}
                                        </Text>
                                    </Box>
                                ))
                            }
                        </Stack>
                    ):(
                        <ChatLoading/>
                    )}
                </Box>
            </Box>
        </>
    )
    
};

export default MyChats;