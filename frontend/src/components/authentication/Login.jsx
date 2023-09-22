import {VStack, StackDivider, Box, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const {user, setUser} = ChatState(); 
    const toast = useToast();
    const navigate = useNavigate();
    const submitHandler = async ()=>{
        setLoading(true); 
        if(!email || !password) {
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
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };
            const {data} = await axios.post(
                "https://chat-app-2nq9.onrender.com/api/user/login", 
                {email, password},
                config                          
            );
            console.log(data);
            toast({
                title: "Login Successful",
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
    return(
        <div>
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
            <Button
                colorScheme='blue'
                width={"100%"}
                style={{marginTop:15}}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign In
            </Button>
        </div>
    );
}
export default Login;