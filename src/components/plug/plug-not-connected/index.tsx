import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { FaInbox } from '@react-icons/all-files/fa/FaInbox';
import React from 'react';

import { PlugButton } from '..';

export interface PlugNotConnectedProps {
  message?: string;
}

export const PlugNotConnected: React.FC<PlugNotConnectedProps> = ({
  message = 'Connect to see the content.',
}) => {
  const bg = useColorModeValue('gray.200', 'gray.800');
  const bgHover = useColorModeValue('gray.200', 'gray.700');

  return (
    <Stack color="gray.500" alignItems="center">
      <Box mt={6} mb={3}>
        <FaInbox size={30} />
      </Box>
      <Text fontSize="lg" pb={3}>
        {message}
      </Text>
      <PlugButton
        size="lg"
        width="80%"
        leftIcon={undefined}
        backgroundColor={bg}
        _before={{}}
        _hover={{
          backgroundColor: bgHover,
        }}
        _disabled={{ backgroundColor: bg, cursor: 'not-allowed' }}
        borderRadius="xl"
      >
        Connect to Plug
      </PlugButton>
    </Stack>
  );
};
