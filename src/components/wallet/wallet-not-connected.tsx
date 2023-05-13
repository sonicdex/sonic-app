import { Box, Stack, Text } from '@chakra-ui/react';
import { FaInbox } from '@react-icons/all-files/fa/FaInbox';
import React from 'react';

import { WalletConnectBtn } from '..';

interface walletNotConnectedProps {
  message?: string;
}

export const WalletNotConnected: React.FC<walletNotConnectedProps> = ({
  message = '',
}) => {
  return (
    <Stack color="gray.500" alignItems="center">
      {message && (
        <>
          <Box mt={6} mb={3}>
            <FaInbox size={30} />
          </Box>
          <Text fontSize="lg" pb={3}>
            {message}
          </Text>
        </>
      )}
      <WalletConnectBtn>
        Connect wallet
      </WalletConnectBtn>
    </Stack>
  );
};
