import React from 'react';

import { Flex, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
type options = {
    tabname?: string;
};

export const SwapSubTab: React.FC<options> = ({ tabname }) => {
    var url = location.pathname;
    const isSwapTab = url == '/swap';
    return (
        <Flex gap={4} direction='row' align='center' alignItems='center' style={{ justifyContent: 'center' }}>
            <Button
                as={Link} colorScheme={isSwapTab ? 'green' : ''} to={'/swap'} variant={isSwapTab ? 'gradient' : 'outline'} px={6}
                >
                Swap
            </Button>
            <Button
                as={Link} colorScheme={isSwapTab ? '' : 'green'} to={'/swap/mint'} variant={isSwapTab ? 'outline' : 'gradient'} px={6}>
                Mint
            </Button>
        </Flex>
    );
}