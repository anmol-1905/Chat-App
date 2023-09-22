import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
function GroupChatModel({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const {user, chats, setChats} = ChatState();
    const handleSearch = async (query)=>{
        setSearch(query);
        if(!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.get(`${process.env.BACKEND_API_ENDPOINT}/api/user/all-users?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch(err) {
            toast({
                title: "Error Occured",
                description: "Failed to load the search result",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
    }
    const handleSubmit = async ()=>{
        if(!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the details",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.post(`${process.env.BACKEND_API_ENDPOINT}/api/chat/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(user=>user._id))
            }, config);
            setChats([data,...chats]);
            onClose();
            toast({
                title: "new group chat created",
                duration: 5000,
                isClosable:true,
                position: "bottom",
                status: "success"
            })
        } catch(err) {
            toast({
                title: "Failed to create the chat",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
    }
    const handleGroup = (user)=>{
        if(selectedUsers.includes(user)) {
           toast({
            title: "Already added",
            duration:5000,
            position: "top",
            status: "warning",
            isClosable: true
           })          
           return;
        }
        setSelectedUsers([...selectedUsers, user]);
    }
    const handleDelete = (user)=>{
        const newArr = selectedUsers.filter((curruser)=> curruser!==user);
        setSelectedUsers(newArr);
    }
    return(
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader fontSize="25px" fontFamily="Work sans" d="flex" justifyContent="center">Create Group</ModalHeader>
                <ModalCloseButton />
                <ModalBody d="flex" flexDir={"column"} alignItems={"center"}>
                    <FormControl>
                        <Input type='text' placeholder="Group Name..." onChange={(e)=>setGroupChatName(e.target.value)} mb={3}/>
                    </FormControl>
                    <FormControl>
                        <Input type='text' placeholder="Add Users" onChange={(e)=>handleSearch(e.target.value)} mb={1}/>
                    </FormControl>
                    <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
                        {
                            selectedUsers.map((user)=>(
                            <UserBadgeItem
                                key={user._id} 
                                user={user} 
                                handleFunction={()=>handleDelete(user)}/>
                            ))
                        }
                    </Box>
                    {
                        loading?<div>loading...</div>:(
                            searchResult?.slice(0, 4).map((user)=>(
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>handleGroup(user)}
                                />
                            ))
                        )
                    }
                   
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                        Create Chat
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
export default GroupChatModel;