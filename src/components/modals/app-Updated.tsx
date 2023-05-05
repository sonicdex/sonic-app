import {
    Flex, Heading, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useColorModeValue
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import packageJSON from '@/../package.json';



var appVer = localStorage.getItem('appver');
type AppUpdatedModalProps = {
    isNotiOpen: boolean;
};

export const AppUpdatedModal: React.FC<AppUpdatedModalProps> = ({ isNotiOpen }) => {

    const [isModelOpen, setisModelOpen] = useState(true);

    useEffect(() => {
        if (packageJSON.version == appVer) {
            setisModelOpen(false);
        }
    }, [appVer])

    function handleClose() {
        localStorage.setItem('appver', packageJSON.version);
        setisModelOpen(false);
    }

    const bg = useColorModeValue('gray.50', 'custom.2');
    const color = useColorModeValue('gray.600', 'custom.1');
    const titleColor = useColorModeValue('gray.800', 'gray.50');
    return isModelOpen ? (
        <Modal isOpen={isModelOpen} isCentered onClose={handleClose}>
            <ModalOverlay />
            <ModalContent as={Flex} maxW="md" direction="column" alignItems="center" bg={bg}
                pt="37px" px="37px" pb="43px" borderRadius={20}
            >
                <ModalCloseButton />
                <Heading as="h2" color={titleColor} fontWeight={700} fontSize="1.2rem" mb={3}>
                    UPDATE NOTIFICATION!
                </Heading>
                <Text as="p" color={color} mb={2}>
                We're excited to announce the launch of new features on SONIC, designed to improve your trading experience. 
                </Text>
                <Text as="p" color={color} mb={2}>
                With the introduction of ICRC support, you can now trade and add liquidity pools for ckBTC, SNS1, and CHAT tokens. We've also implemented ICP, allowing you to trade and create LP for your favorite tokens using ICP without affecting current WICP pairs.
   
                </Text>
                <Text as="p" color={color} mb={2}>
                Additionally, we've streamlined the ICP Wrapping process under the mint option for greater ease of use. 
                </Text>
                <Text as="p" color={color} mb={2}>
                By default, tokens will be kept in your sonic wallet to facilitate high-frequency trading, where even a few extra seconds matter a lot. However, during the swap,
                 you can uncheck this feature if you want to withdraw directly to your web wallet.
                 <a style={{color:"#008eff" , fontWeight:"bold" }} href='https://docs.sonic.ooo/product/assets#keeping-assets-in-sonic-after-a-swap' target="_blank">Learn more</a>
                </Text>
                <Text as="p" color={color} mb={2}>
                    We're confident that these updates will enhance your trading efficiency on Sonic DEX. Thank you for choosing Sonic DEX!
                </Text>
            </ModalContent>
        </Modal>
    ) : <></>;
};
