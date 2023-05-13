import {
    Flex, Heading, Modal, ModalCloseButton, ModalContent, ModalOverlay, useColorModeValue, ModalHeader, ModalBody,
    Stack, Image, Box, Text, Spinner
} from '@chakra-ui/react';
import React from 'react';

import { useWalletStore, walletState, useAppDispatch, walletActions } from '@/store';

import {artemis} from '@/integrations/artemis';

import { tokenList} from '@/utils'
import { ENV } from '@/config';

export const WalletListModal: React.FC = () => {
    const { state , walletSelected} = useWalletStore();
    const dispatch = useAppDispatch();

    function handleClose() {
        dispatch(walletActions.setOnwalletList(walletState.Idle));
    }
    async function handleSelectWallet(id: string) {
        var tknList= tokenList("obj");
        const connectObj = {
            host: ENV.host,
            whitelist: [...Object.values(ENV.canistersPrincipalIDs),...Object.keys(tknList)],
        }
        dispatch(walletActions.setWalletSelected(id));
        dispatch(walletActions.setOnwalletList(walletState.Connecting));
        var connectInfo = await artemis.connect(id,connectObj);
        if(connectInfo){
            if(artemis?.principalId && artemis?.provider){
                dispatch(walletActions.setWalletLoaded({ principleId: artemis.principalId ,accountId: artemis.accountId ,walletActive:artemis.walletActive }) );
            }
        }else{
            dispatch(walletActions.setOnwalletList(walletState.OpenWalletList));
        }
    }
    const bg = useColorModeValue('gray.50', 'custom.2');
    const titleColor = useColorModeValue('gray.800', 'gray.50');

    



    return (
        <Modal isOpen={(state == walletState.OpenWalletList || state == walletState.Connecting) ? true : false} isCentered onClose={handleClose}>
            <ModalOverlay />
            <ModalContent as={Flex} maxW="sm" direction="column" alignItems="center" bg={bg}
                pt="36px" px="20px" pb="44px" borderRadius={20}
            >
                <ModalCloseButton />
                {(state == walletState.OpenWalletList) &&
                    <>
                        <ModalHeader>
                            <Heading textAlign={'left'} as="h2" color={titleColor} fontWeight={700} fontSize="1.2rem" mb={4}>
                                Connect Wallet
                            </Heading>
                        </ModalHeader>
                        <ModalBody mt={4} p={0}>
                            {artemis?.wallets.map((item: any, i) => (
                                <Stack width="100%" maxWidth="100%" direction={['column', 'row']} key={i}
                                    alignItems="center" mt={2} cursor="pointer" mb={2} pt={1} pb={1} pl={2} pr={20} border="1px solid rgb(63, 81, 181)" borderRadius="60px"
                                    onClick={() => handleSelectWallet(item?.id)}
                                >
                                    <Box mr={4}>
                                        <Image borderRadius='full' boxSize='36px' src={item?.icon} alt='' bg={'gray.800'} />
                                    </Box>
                                    <Box>
                                        <Text fontSize='14px' > {item?.name}</Text>
                                        <Text fontSize='12px' color={'gray.300'} >{item?.adapter.readyState}</Text>
                                    </Box>
                                </Stack>
                            ))}
                        </ModalBody>
                    </>
                }
                {(state == walletState.Connecting) &&
                    <>
                        <ModalHeader>
                            <Heading textAlign={'left'} as="h2" color={titleColor} fontWeight={700} fontSize="1.2rem" mb={4} textTransform={'capitalize'}>
                                Connecting {walletSelected} Wallet
                            </Heading>
                        </ModalHeader>
                        <ModalBody mt={4} p={4}>
                            <Spinner thickness='4px' speed='0.65s' emptyColor='rgba(0, 0, 0, 0.5)' color='blue.500' size='xl' />
                        </ModalBody>
                    </>
                }
            </ModalContent>
        </Modal>
    );
};
