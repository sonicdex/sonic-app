import { Box, Flex } from '@chakra-ui/react';
import { Button } from '@/components';
import { ModalComponentProps } from '../modals';

export const SwapFailed = ({
  callbacks = [() => {}, () => {}],
}: Partial<ModalComponentProps>) => (
  <Flex
    alignItems="center"
    direction="column"
    justifyContent="center"
    borderRadius="20px"
    width="420px"
    bg="#1E1E1E"
    pt="37px"
    px="20px"
    pb="35px"
  >
    <Box as="h1" fontWeight={700} fontSize="22px" pb="13px">
      Swap Failed
    </Box>
    <Box as="p" pb="27px" fontSize="16px" color="#888E8F">
      Please choose an option below
    </Box>
    <Button
      title="Retry Swap"
      borderRadius={12}
      fontWeight={700}
      fontSize={18}
      onClick={callbacks[0]}
    />
    <Box mt="18px" w="100%">
      <Button
        title="Withdraw to Plug"
        borderRadius={12}
        fontWeight={700}
        fontSize={18}
        onClick={callbacks[1]}
        wireframe
      />
    </Box>
  </Flex>
);
