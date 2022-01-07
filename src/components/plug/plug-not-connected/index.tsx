import { Box, Stack, Text } from '@chakra-ui/react';
import { FaInbox } from '@react-icons/all-files/fa/FaInbox';
import React from 'react';

import { PlugButton } from '..';

export interface PlugNotConnectedProps {
  message?: string;
}

export const PlugNotConnected: React.FC<PlugNotConnectedProps> = ({
  message = 'Connect to see the content.',
}) => {
  return (
    <Stack color="gray.500" alignItems="center">
      <Box mt={6} mb={3}>
        <FaInbox size={30} />
      </Box>
      <Text fontSize="lg" pb={3}>
        {message}
      </Text>
      <PlugButton width="80%" variant="dark">
        Connect to Plug
      </PlugButton>
    </Stack>
  );
};
