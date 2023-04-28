import React from 'react';

import { Flex, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
type options = {
    tabname?: string;
};

export const SwapSubTab: React.FC<options> = ({ tabname }) => {
    var url = location.pathname;
    return (
        <Flex gap={4} direction='row' align='center' alignItems='center' style={ {justifyContent: 'center'}}>
            <Button style={
                { backgroundColor: (url == '/swap')?'#3F51B5' :'transparent' , border:"1" , color:'white' , borderColor:'#3F51B5' }} 
                as={Link} colorScheme='blue'  to={'/swap'} variant='outline' px={6}>
              Swap
            </Button>
            <Button  style={
                { backgroundColor: (url == '/swap/mint')?'#3F51B5' :'transparent' , border:"1" , color:'white' , borderColor:'#3F51B5' }} 
                as={Link} colorScheme='blue'  to={'/swap/mint'} variant='outline'  px={6}>
            Mint
            </Button>
        </Flex>
    );
}