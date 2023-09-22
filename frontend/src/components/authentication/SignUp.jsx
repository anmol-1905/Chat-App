import {VStack, StackDivider, Box, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import { useState } from 'react';
import { CloudinaryContext, Image } from 'cloudinary-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [picture, setPicture] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const {user, setUser} = ChatState();
    const submitHandler = async ()=>{
        setLoading(true);
        if(!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
            return;
        }
        if(password!==confirmPassword) {
            toast({
                title: "Password and confirm password are not same",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
            return;
        } else {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json"
                    }
                };
                const {data} = await axios.post(`${process.env.BACKEND_API_ENDPOINT}/api/user/register`, 
                    {name, email, password, picture},
                    config                          
                );
                toast({
                    title: "Registration Successful",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
                localStorage.setItem("userInfo", JSON.stringify(data));
                setLoading(false);
                setUser(data);
                navigate("/chats");
            } catch(err) {
                toast({
                    title: "Something went wrong",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
                setLoading(false);
            }
        }
    }
    const postDetails = (picture)=>{
        setLoading(true);
        if(picture===undefined) {
            toast({
                title: "Please select a image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        if(picture.type==="image/jpeg" || picture.type==="image/png") {
            const formData = new FormData();
            formData.append("file", picture);
            formData.append("upload_preset", "chat-app");
            formData.append("cloud_name", "dtpwubkv2");
            axios.post(`https://api.cloudinary.com/v1_1/dtpwubkv2/image/upload`, formData)
                .then(res=>{
                    console.log(res);
                    console.log(res.data.secure_url);
                    setPicture(res.data.secure_url);
                    setLoading(false);
                })
                .catch(err=>{
                    console.log(err.message)
                });
            
        } else {
            toast({
                title: "Please select a image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    }
    return(
       <VStack spacing={"5px"} color={"black"}>
            <FormControl id='name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input 
                    placeholder='Enter your name' 
                    onChange={(e)=>setName(e.target.value)}/>
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                    placeholder='Enter your email' 
                    onChange={(e)=>setEmail(e.target.value)}/>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input 
                    type={show? "text": "password"}
                    placeholder='Enter your password' 
                    onChange={(e)=>setPassword(e.target.value)}/>
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.75rem"} size={"sm"} onClick={()=>setShow(!show)}>
                            {show? "Hide": "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirmPassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input 
                    type={show? "text": "password"}
                    placeholder='Confirm Password' 
                    onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.75rem"} size={"sm"} onClick={()=>setShow(!show)}>
                            {show? "Hide": "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Upload your picture</FormLabel>
                <Input 
                    type='file' 
                    p={1.5} 
                    accept='image/*'
                    onChange={(e)=>postDetails(e.target.files[0])}
                    />
            </FormControl>
            <Button
                colorScheme='blue'
                width={"100%"}
                style={{marginTop:15}}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
       </VStack>
    );
}
export default Signup;