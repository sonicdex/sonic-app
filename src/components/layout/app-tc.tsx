import { useEffect, useState } from 'react';
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useColorModeValue, Heading, Text, Checkbox, Flex
} from '@chakra-ui/react';


type tandCModalProps = {
    isOpened: boolean,
}

export const TandCModal: React.FC<tandCModalProps> = ({ isOpened }) => {

    const bg = useColorModeValue('gray.50', 'custom.2');
    const titleColor = useColorModeValue('gray.800', 'gray.50');

    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };


    const handleAgree = () => {
        if (isChecked) {
            localStorage.setItem('tandcagreedv2', '1');

            const customEvent = new CustomEvent('tandcagreedv2');
            window.dispatchEvent(customEvent);

        } else {
            localStorage.setItem('tandcagreedv2', '');
        }
        setIsOpen(false);

        triggerModalClose();

    };

    const triggerModalClose = () => {
        const customEvent = new CustomEvent('app-tcmodalclose', { detail: isOpen });
        window.dispatchEvent(customEvent);
    }


    useEffect(() => {
        setIsOpen(isOpened);
    }, [isOpened]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { triggerModalClose(); setIsOpen(false) }} size={'2xl'}>
                <ModalOverlay />
                <ModalContent bg={bg} >
                    <ModalHeader>
                        <Heading textAlign={'center'} as="h2" color={titleColor} fontWeight={700} fontSize="1.2rem" mb={3} mt={3} textColor='red.500'>
                            Risk Advisory!
                        </Heading>
                    </ModalHeader>
                    <ModalBody>
                        <Text mt="4" lineHeight={1.5}>
                            Using Canisters (Smart Contracts) may not always be secure, and inherent risks exist when dealing with Tokens and cryptocurrencies.
                            Prioritize conducting your own research before investing.
                            <br />
                            Sonic's Decentralized Nature: Sonic operates as a decentralized DAO Governed financial hub, facilitating various token transactions
                            within its ecosystem, all deployed on the Internet Computer. Transactions can be verified using the Internet Computer protocol.
                            Your responsibility for safeguarding your funds is paramount. Ensure the security of your funds and remain vigilant against potential fraud.
                            <br />
                            Wallet Seed Phrase Security: Whoever possesses the seed phrase of a wallet address gains control over the funds in that wallet.
                            Never share your seed phrase, even with the Sonic team, under any circumstances.
                            <br />
                            Guard Against Phishing Attacks: Exercise caution against phishing attempts and verify that you're accessing <a href='https://app.sonic.com '> https://app.sonic.com </a> - carefully examine the URL to ensure authenticity.
                            <br />
                            Official Updates: Stay informed about SONIC events and news via SONIC's Twitter: @sonic_ooo.
                            <br />
                            Caution Regarding Meme Tokens/Scams: Given our complete decentralization, it's crucial to acknowledge that the project launched may involve meme tokens or potential scams. Thoroughly scrutinize and comprehend the project before making any investments.
                            <br />
                            Crypto Asset Risks: Investing in crypto assets involves inherent risks. Sonic does not assure the performance or success of projects/tokens. Investors should exercise caution and make informed decisions.
                            <br />
                            Beware of Fund Requests: Sonic's team will never request tokens from anyone. If you encounter platform issues or fund loss, submit a support ticket on Sonic Discord without sharing sensitive information in the general chat.
                            <br />
                            The SONIC founding team reserves the right to provide the final interpretation of all statements.
                            <br />
                            <br />
                            This revised warning aims to succinctly communicate the risks associated with using Sonic's platform and offers guidance to users for safer interactions within the ecosystem.
                        </Text>
                    </ModalBody>
                    <ModalFooter paddingStart={0} mb={10} >
                        <Flex px="4">
                            <Checkbox isChecked={isChecked} onChange={handleCheckboxChange} marginRight="10">
                                I have read the risk warning carefully and agree to take the risk myself
                            </Checkbox>
                            <Button colorScheme="green" onClick={handleAgree}>
                                Close
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
