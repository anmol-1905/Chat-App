import { ViewIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Image,
  Text,
} from '@chakra-ui/react'
function ProfileModal({user, children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // console.log(user);
  return (
    <>
      <div>
        {children?(<span onClick={onOpen}>{children}</span>):
            (<IconButton
                d={{base:"flex"}}
                icon={<ViewIcon/>}
                onClick={onOpen}
        />)}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h={"400px"}>
          <ModalHeader fontSize={"40px"} fontFamily={"Work sans"} style={{display:"flex", justifyContent:"center"}}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{display:"flex", justifyContent:"center", flexDirection:"column"}} alignItems="center">
                <Image
                    borderRadius="full"
                    boxSize={"150px"}
                    src={user.picture}
                    alt={user.name}
                />
                <Text m={"5px"}>
                    {user.email}
                </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </div>
    </>
  );
}

export default ProfileModal;