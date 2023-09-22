import { Avatar, Box, Button, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import {BellIcon, ChevronDownIcon, SearchIcon} from '@chakra-ui/icons';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import {Effect} from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';
function SideDrawer() {
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();
    console.log(user.user);
    const navigate = useNavigate();
    const logoutHandler = ()=>{
        localStorage.removeItem("userInfo");
        navigate("/");
    }
    const handleSearch = async ()=>{
        if(!search) {
            toast({
                title:"Please enter something",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem("userInfo"));
            console.log(user.token);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.get(`http://localhost:5000/api/user/all-users?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch(err) {
            toast({
                title: "faild to load the search results",
                isClosable: true,
                position: "top-left",
                duration: 5000,
                status: "warning"
            })
            return;
        }
    }
    const accessChat = async( userId )=>{
        try {
            setLoading(true);
            setLoadingChat(true);
            const user = JSON.parse(localStorage.getItem("userInfo"));
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.post(`http://localhost:5000/api/chat`, {userId}, config);
            if(!chats.find((c)=>c._id===data._id))
                setChats([data, ...chats]);
            setSelectedChat(data);
            setLoading(false);
            setLoadingChat(false);
            onClose();
        }catch(err) {
            toast({
                title: "error fetching the chat",
                description: err.message,
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
            return;
        }
    }
    return (
        <>
            <Box
            style={{display:"flex", justifyContent:"space-between"}}
            alignItems={"center"}
            bg={"white"}
            w={"100%"}
            p={"5px 10px 5px 10px"}
            borderWidth={"5px"}>
                <Tooltip label="Search user" hasArrow placement="bottom-end" >
                    <Button variant={"ghose"} onClick={onOpen}>
                        <SearchIcon/>
                        <Text d={{base:'none', md:'flex'}} px={"4"}>Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"} fontFamily={"sans-serif"}>Chat!</Text>
                <div>
                    <Menu>
                        <MenuButton p={"1"} rightIcon={<ChevronDownIcon />}>
                        <NotificationBadge
                            count={notification.length}
                            effect={Effect.SCALE}
                        />
                            <BellIcon fontSize={"2xl"} m={"1"}/>
                        </MenuButton>
                        <MenuList pl={2}>
                            {
                                !notification.length && "No new message"
                            }
                            {
                                notification.map(notify=>(
                                    <MenuItem key={notify._id} onClick={()=>{
                                        setSelectedChat(notify.chat)
                                        setNotification(notification.filter((n)=>n!==notify))
                                    }}>
                                        {
                                            notify.chat.isGroupChat?`New Message in ${notify.chat.chatName}`:`New Message from ${getSender(user.user, notify.chat.users)}`
                                        }
                                    </MenuItem>
                                ))
                            }
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                            <Avatar size={"sm"} cursor="pointer" name={user.user.name} src={user.picture}/>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user.user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>   
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose}  isOpen={isOpen}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
                    <DrawerBody>
                    <Box style={{display:"flex", flexDirection:"row"}} pb={2}>
                        <Input
                            placeholder="Search by name or email"
                            mr={2}
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                        />
                        <Button onClick={handleSearch}>Go</Button>
                    </Box>
                    {loading?(
                        <ChatLoading/>
                    ):(
                        searchResult.map((user)=>(
                            <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={()=>accessChat(user._id)}
                            />
                        ))
                    )}
                    {loadingChat && <Spinner ml={"auto"} d="flex"/>}
                </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
export default SideDrawer;