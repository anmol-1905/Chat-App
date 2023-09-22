import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessages, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { ChatState } from '../context/ChatProvider';
function ScrollableChat({messages}) {
    const {user} = ChatState();
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i)=>{
                console.log("HELLO", m);
                console.log("User", user.user._id);
                return <div style={{display:"flex"}} key={m._id}>
                    {(isSameSender(messages, m, i, user.user._id)
                    || isLastMessages(messages,i, user.user._id)) && (
                        <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                        <Avatar
                        mt={1}
                        size={"sm"}
                        cursor={"pointer"}
                        name={m.sender.name}
                        src={m.sender.picture}
                        />
                        </Tooltip>
                    )
                    }
                    <span style={{
                        backgroundColor:`${
                            m.sender._id===user.user._id ? "lightgreen" : "lightblue"
                        }`,
                        borderRadius: "20px",
                        padding:"5px 10px",
                        maxWidth:"75%",
                        marginLeft: isSameSenderMargin(messages, m, i, user.user._id),
                        marginTop: isSameUser(messages, m, i, user.user._id)?3:10
                    }}>
                    {
                        m.content
                    }
                    </span>
                </div>
            })}
        </ScrollableFeed>
    )
}

export default ScrollableChat;