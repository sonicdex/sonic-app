import { useState, useEffect } from 'react';
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useColorModeValue,
    FormControl, FormErrorMessage, Stack, HStack, Select, ModalCloseButton, FormLabel, Text
} from '@chakra-ui/react';

import { FaRedoAlt } from '@react-icons/all-files/fa/FaRedoAlt';
import { useSwapCanisterStore } from '@/store';

import { Principal } from '@dfinity/principal';
import { BatchTransact } from 'artemis-web3-adapter';
import { artemis } from '@/integrations/artemis';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';

import { NotificationType, useNotificationStore } from '@/store';

type RetryProps = {
    isRetryOpen?: Number;
};

export const RetryFailedTrxModal: React.FC<RetryProps> = ({ isRetryOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tokenErrorMessage, setRokenError] = useState('');
    const [tokenSelected, settokenSelected] = useState('');
    const [buttonText, setbuttonText] = useState('Retry');
    const { supportedTokenList } = useSwapCanisterStore();
    const [isTokenTrx, setisTokenTrx] = useState(false);

    const { addNotification } = useNotificationStore();

    setRokenError; setisTokenTrx; setbuttonText; BatchTransact; artemis;
    // setRokenError; supportedTokenList; supportedTokenListState; tokenSelected;

    const bg = useColorModeValue('gray.50', 'custom.2');
    const titleColor = useColorModeValue('gray.800', 'gray.50');

    useEffect(() => {
        if (supportedTokenList?.length && !tokenSelected)
            settokenSelected(supportedTokenList[0]?.id);
    }, [supportedTokenList])


    useEffect(() => {
        if (isRetryOpen) { setIsOpen(true) }
        else setIsOpen(false);
    }, [isRetryOpen])

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setisTokenTrx(true);
        const trx = new BatchTransact({
            retry: {
                canisterId: ENV.canistersPrincipalIDs.swap,
                idl: SwapIDL.factory,
                methodName: 'retryDeposit',
                onSuccess: () => { },
                onFail: () => { },
                args: [Principal.fromText(tokenSelected)]
            }
        }, artemis);

        trx.execute().then((data: any) => {
            if(data){
                addNotification({ title: `Added Failed Transaction balance`, type: NotificationType.Success, id: String(new Date().getTime()), });
            }else{
                addNotification({ title: `No pending deposits`, type: NotificationType.Error, id: String(new Date().getTime()), });
            }
            setIsOpen(false);
            setisTokenTrx(false);
        }).catch((err: any) => {
            setisTokenTrx(false);
            setIsOpen(false);
            addNotification({ title: `Error in Transaction. Please try again`, type: NotificationType.Error, id: String(new Date().getTime()), });
        })
    };
    const handleTokenSelect = async (event: any) => {
        event.preventDefault();
        settokenSelected(event.target.value);
    };


    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered closeOnOverlayClick={!isTokenTrx}>
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit} noValidate bg={bg}>
                {isTokenTrx == false && <ModalCloseButton />}
                <ModalHeader borderBottom="none" pt={8}>
                    Retry Failed Deposit
                    <Text mt={3} textAlign="center" fontSize="sm" color={titleColor}>
                        Use this form to retry any of your failed Deposit.
                    </Text>
                </ModalHeader>
                <ModalBody as={Stack} spacing={4} pt={6} pb={4}>
                    <FormControl isRequired isInvalid={Boolean(tokenErrorMessage)}>
                        <FormLabel>Select Token</FormLabel>
                        <Select name="token" value={tokenSelected} onChange={handleTokenSelect}>
                            {supportedTokenList?.map((option, index) => (
                                <option key={index} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </Select>
                        <FormErrorMessage>{tokenErrorMessage}</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <ModalFooter as={HStack}>
                    <Button isLoading={isTokenTrx} width={'100%'} leftIcon={<FaRedoAlt />} type="submit" variant="gradient" colorScheme="dark-blue">
                        {buttonText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};