
import { Alert, useColorModeValue, Button, Flex  , Container} from '@chakra-ui/react';
import { TandCModal } from './app-tc';

import { useState } from 'react';



export const BottomWarning: React.FC = () => {

    const bg = useColorModeValue('gray.50', 'custom.2');
    const [tandcagreedStat, setTandcagreedStat] = useState(localStorage.getItem('tandcagreedv2'));

    window.addEventListener('tandcagreedv2', (e) => {
        console.log('tandcagreedv2')
        setTandcagreedStat(localStorage.getItem('tandcagreedv2'))
    });

    window.addEventListener('app-tcmodalclose', (e) => {
        setIsOpen(false);
    });


    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(true);
    }

    return (
        <>
            {(!tandcagreedStat) ? (
                <>
                    <TandCModal isOpened={isOpen}></TandCModal>
                    <Alert status="info" mb={0} bg={bg} borderRadius={'0'} position={'fixed'} bottom={0} justifyContent={'center'} zIndex={3000}>
                    <Container  maxW={['100%', 'container.xl', 'container.xl']}>
                        <Flex
                            flexDirection={{ base: 'column', md: 'row' }} 
                            alignItems={{ base: 'stretch', md: 'center' }} 
                            gap={10}
                        >
                            <Flex flex={{ base: '100%', md: '60%' }}>
                                Using Canisters (Smart Contracts) may not always be secure, and inherent risks exist when dealing with Tokens and cryptocurrencies.
                                Prioritize conducting your own research before investing.</Flex>
                            <Flex flex={{ base: '100%', md: '40%' }}>
                                <Button onClick={handleClick}>Read Risk Advisory and agree</Button>
                            </Flex>
                        </Flex>
                        </Container>
                    </Alert>
                </>
            ) : (<></>)}
        </>
    );
}