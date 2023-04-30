import {
    Flex, Heading, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useColorModeValue
} from '@chakra-ui/react';
import React,{ useState , useEffect}  from 'react';
import packageJSON from '@/../package.json';



var appVer = localStorage.getItem('appver');
type AppUpdatedModalProps =  {
    isNotiOpen: boolean;
};
  
export const AppUpdatedModal: React.FC<AppUpdatedModalProps>  = ({ isNotiOpen }) => {

    const [isModelOpen, setisModelOpen] = useState(true);
    
    useEffect(() => {
        if(packageJSON.version == appVer){
            setisModelOpen(false);
        }    
    },[appVer])
    
    function handleClose() {
        localStorage.setItem('appver',  packageJSON.version);
        setisModelOpen(false);
    }

    const bg = useColorModeValue('gray.50', 'custom.2');
    const color = useColorModeValue('gray.600', 'custom.1');
    const titleColor = useColorModeValue('gray.800', 'gray.50');
    return  isModelOpen?(
        <Modal isOpen={isModelOpen} isCentered onClose={handleClose}>
            <ModalOverlay />
            <ModalContent as={Flex} maxW="md" direction="column" alignItems="center" bg={bg}
                pt="37px" px="37px" pb="43px" borderRadius={20} 
            >
                <ModalCloseButton />
                <Heading as="h2" color={titleColor} fontWeight={700} fontSize="1.2rem" mb={3}>
                    UPDATE NOTIFICATION!
                </Heading>
                <Text as="p" color={color}>
                We are pleased to announce that we have launched some new features on SONIC that we believe will greatly enhance your trading experience.
                <br/> <br/>
We have introduced ICRC support, which means that you can now trade and add liquidity pool (LP) for ckBTC, SNS1, and CHAT tokens on our platform.
<br/> <br/>
We have also implemented ICP, which means that you can now trade and create LP for your favorite tokens using ICP. This new addition will not affect current WICP pairs and activities, and you can enjoy trading with both WICP and ICP simultaneously.
<br/> <br/>
In addition to the above, we have separated ICP warping from the swap and added it under the mint option, which will help users to easily warp/unwrap ICP.
<br/> <br/>
We hope these updates will help you trade more effectively and efficiently. Thank you for using Sonic DEX!
                </Text>
            </ModalContent>
        </Modal>
    ):<></>;
};
