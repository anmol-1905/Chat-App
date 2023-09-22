import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

function UserBadgeItem({user, handleFunction}) {
    return <>
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
        onClick={handleFunction}
        backgroundColor={"purple"}
        color={"white"}>
            {user.name}
            <CloseIcon pl={1} onClick={()=>handleFunction(user)}/>
        </Box>
    </>
};
export default UserBadgeItem;