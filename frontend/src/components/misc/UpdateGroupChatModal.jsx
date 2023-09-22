import { ViewIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import { useState } from "react";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";


function UpdateGroupChatModal({fetctAgain, setFetchAgain, fetchMessages}) {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);
    const toast = useToast();
    const {selectedChat, setSelectedChat, user} = ChatState();
    const handleDelete = ()=>{

    }
    const handleRename = async()=>{
        if(!groupChatName) {
            return;
        }
        try{
            setRenameloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            
            const {data} = await axios.put(`https://chat-app-2nq9.onrender.com/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetctAgain);
            setRenameloading(false);
            toast({
                title: "Group name changed",
                status: "success",
                duration: 3000,
                isClosable:true,
                position: "top"
            })
        }catch(err) {
            toast({
                title: "Could not change the name",
                status: "error",
                duration: 3000,
                isClosable:true,
                position: "top"
            });
            setRenameloading(false);
        }
        setGroupChatName("");
    }
    const handleSearch = async(query)=>{
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
            const {data} = await axios.get(`https://chat-app-2nq9.onrender.com/api/user/all-users?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch(err) {
            toast({
                title: "Error Occured",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
    }
    const handleAddUser = async (user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id)) {
            toast({
                title: "User already in group",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        if(selectedChat.groupAdmin._id!==user.user._id) {
            toast({
                title: "Only admins can add someone",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.put(`https://chat-app-2nq9.onrender.com/api/chat/addToGroup`, {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetctAgain);
            setLoading(false);
            toast({
                title: "User added",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
        }catch(err) {
            toast({
                title: "Could not add",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
    }
    const handleRemove = async(user1)=>{
        if(selectedChat.groupAdmin._id!==user.user._id) {
            toast({
                title: "Only admins can remove someone",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        if(selectedChat.groupAdmin._id===user1._id) {
            toast({
                title: "Admin can not leave",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const {data} = await axios.put(`https://chat-app-2nq9.onrender.com/api/chat/removeFromGroup`, {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);
            user1._id===user._id? setSelectedChat(): setSelectedChat(data);
            setFetchAgain(!fetctAgain);
            fetchMessages();
            setLoading(false);
            toast({
                title: "User removed",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
        }catch(err) {
            toast({
                title: "Could not remove",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
    }
    return (
        <>
            <IconButton 
            onClick={onOpen}
            display={"flex"}
            icon={<ViewIcon/>}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize={"35px"}
          fontFamily={"Work sans"}
          display={"flex"}
          justifyContent={"center"}
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
                {
                    selectedChat.users.map((user)=>{
                        return <UserBadgeItem
                        key={user._id} 
                        user={user} 
                        handleFunction={()=>handleRemove(user)}/>
                })
                }
            </Box>
            <FormControl display={"flex"}>
                <Input
                placeholder="New Group Name..."
                mb={3}
                value={groupChatName}
                onChange={(e)=>setGroupChatName(e.target.value)}
                />
                <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
                >Update</Button>
            </FormControl>
            <FormControl display={"flex"}>
                <Input
                placeholder="Add user.."
                mb={3}
                value={search}
                onChange={(e)=>handleSearch(e.target.value)}
                />
            </FormControl>
            {
                loading?(
                    <Spinner size={"lg"}/>
                ):(
                    searchResult?.map((user)=>{
                        console.log(user);
                        return <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={()=>handleAddUser(user)}
                        />
                    })
                )
            }
          </ModalBody>

          <ModalFooter display={"flex"} justifyContent={"space-between"}>
           <Box
            px="2"
            py="1"
            borderRadius="lg"
            m="1"
            mb="2"
            varient="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"
            backgroundColor={"#79AC78"}
            color={"white"}>
            Admin: {selectedChat.groupAdmin.name}
            </Box>
            <Button onClick={()=>handleRemove(user)} colorScheme="red">
            {/* TODO write function for leave */}
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}
export default UpdateGroupChatModal;