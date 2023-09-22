import { Container, Box , Text} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/SignUp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function HomePage() {
    const navigate = useNavigate();
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if(userInfo) {
            navigate("/chats");
        }
    }, [navigate])
    return (
        <Container maxW='xl' centerContent>
            <Box 
                d="flex" 
                justifyContent="center" 
                p={3} bg={"white"} 
                w={"100%"} 
                m="40px 0 15px 0" 
                borderRadius="lg" 
                borderWidth="1px">
                <Text 
                    fontSize="4xl" 
                    color="black" 
                    display={"flex"} 
                    justifyContent={"center"}>
                    Chat !!
                </Text>
            </Box>
            <Box bg={"white"} w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"}>
                <Tabs variant='soft-rounded'>
                  <TabList  variant='soft-rounded' colorScheme='green'>
                    <Tab width={"50%"}>Login</Tab>
                    <Tab width={"50%"}>Signup</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Login/>
                    </TabPanel>
                    <TabPanel>
                      <Signup/>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
};
export default HomePage;