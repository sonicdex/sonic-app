import {
    Flex, Heading, Modal, ModalCloseButton, ModalContent, ModalOverlay, useColorModeValue, ModalBody, Box, Text, HStack, Button
} from '@chakra-ui/react';
import React, { useState, useEffect, useMemo } from 'react';

import QRCode from "react-qr-code";
import { FiCopy } from '@react-icons/all-files/fi/FiCopy';
type DepostAddressProps = {
    isNotiOpen: boolean;
    tokenId?: string;
    onclose?: any;
};

import { tokenList } from '@/utils'
import { useWalletStore } from '@/store';

import { desensitizationPrincipalId } from '@/utils/canister';
import { copyToClipboard } from '@/utils';

export const DepostAddressModal: React.FC<DepostAddressProps> = ({ isNotiOpen, tokenId, onclose }) => {
    const [isModelOpen, setisModelOpen] = useState(isNotiOpen);

    const { accountId, principalId } = useWalletStore();

    useEffect(() => {
        setisModelOpen(isNotiOpen);
    }, [isNotiOpen])

    function handleClose() {
        setisModelOpen(false);
        onclose()
    }
    const shortPrincipalId = useMemo(() => {
        return desensitizationPrincipalId(principalId);
    }, [principalId]);

    const shortAccntId =  useMemo(() => {
        return desensitizationPrincipalId(accountId);
    },[accountId])

    const handleCopy = (type:string) => {
        if(type =='princ'){
            if (principalId) {
                copyToClipboard(principalId, 'Principal ID copied to clipboard');
            }
        }else if(type =='acntid'){
            if (accountId) {
                copyToClipboard(accountId, 'Account ID copied to clipboard');
            }
        }else if(type == 'tokenid'){
            if (tokenId) {
                copyToClipboard(tokenId, 'Token Canister ID copied to clipboard');
            }
        }
    };
    
    const tokenData = tokenId ? tokenList('obj', tokenId) : {};
    const bg = useColorModeValue('gray.50', 'custom.2');
    const titleColor = useColorModeValue('gray.800', 'gray.50');
    return isModelOpen ? (
        <Modal isOpen={isModelOpen} isCentered onClose={handleClose}>
            <ModalOverlay />
            <ModalContent as={Flex} maxW="xl" direction="column" alignItems="center" bg={bg}
                pt="37px" px="37px" pb="43px" borderRadius={20}
            >
                <ModalCloseButton />
                <Heading as="h4" color={titleColor} fontWeight={600} fontSize={'1.3rem'}>
                    Deposit {tokenData?.symbol}
                  
                </Heading>
                <Box mb={3}>
                    <br/>
                    <p> <b>Token Canister  :  </b> <span style={{userSelect:'all' , marginRight:'5px'}}>{tokenData?.id}</span> <Box onClick={()=>handleCopy('tokenid')} cursor={'pointer'} as={FiCopy} display={'inline-flex'}/></p>
                </Box>
               
                <ModalBody mt={4} p={0} display={'contents'}>
                    <Box width={'full'} py={3} px={2} >
                        <Heading as="h2" color={titleColor} fontWeight={400} fontSize="1.2rem" mb={3}>
                            Use Principal ID
                        </Heading>
                        <Flex width={'100%'} border="1px solid rgb(63, 81, 181)" borderRadius={'lg'} py={3} px={2}>
                            <Box display="flex" width={'100%'} alignItems="center"  justifyContent="start">
                                <Box mr={4}>Principal ID</Box>
                                <Button onClick={()=>handleCopy('princ')} >
                                    <HStack px={10} p={3}>
                                        <FiCopy />
                                        <Text> {shortPrincipalId}</Text>
                                    </HStack>
                                </Button>
                            </Box>
                            <Box border="1px solid rgb(63, 81, 181)" p={1} borderRadius={'md'} >
                                {principalId && <QRCode value={principalId} size={100} />}
                            </Box>
                        </Flex>
                    </Box>

                    <Box width={'full'} py={3} px={2} mt="3" >
                        <Heading as="h2" color={titleColor} fontWeight={400} fontSize="1.2rem" mb={3}>
                            Use Account ID
                        </Heading>
                        <Flex width={'100%'} border="1px solid rgb(63, 81, 181)" borderRadius={'lg'} py={3} px={2}>
                        <Box display="flex" width={'100%'} alignItems="center"  justifyContent="start" >
                                <Box mr={4}>Account ID</Box>
                                <Button onClick={()=>handleCopy('acntid')} >
                                    <HStack px={10} p={3}>
                                        <FiCopy />
                                        <Text> {shortAccntId}</Text>
                                    </HStack>
                                </Button>
                            </Box>
                            <Box border="1px solid rgb(63, 81, 181)" p={1} borderRadius={'md'} >
                                {accountId && <QRCode value={accountId} size={100} />}
                            </Box>
                        </Flex>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    ) : <></>;
};
