import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import SideDrawer from '../components/misc/SideDrawer';
import { Box } from '@chakra-ui/react';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
function ChatsPage() {
    const {user} = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    return(
        <div style={{width: "100%"}}>
            {user && <SideDrawer/>}
            <Box
            style={{display:"flex", flexDirection:"row", justifyContent:'space-between', }}
            w={"100%"}
            h={"91.5vh"}
            p={"10px"}
            >
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
)}
            </Box>
        </div>
    )
};
export default ChatsPage;