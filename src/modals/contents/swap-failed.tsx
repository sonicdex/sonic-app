import { Flex, Heading, Text, ModalCloseButton } from '@chakra-ui/react';
import { Button } from '@/components';
import { ModalComponentProps } from '../modals';

export const SwapFailed = ({
  callbacks = [() => {}, () => {}],
}: Partial<ModalComponentProps>) => (
  <Flex
    alignItems="center"
    direction="column"
    justifyContent="center"
    borderRadius={20}
    bg="#1E1E1E"
    pt={9}
    px={5}
    pb={9}
  >
    <ModalCloseButton position="absolute" top="10px" right="15px" />
    <Heading as="h1" fontWeight={700} fontSize={22} pb={3}>
      Swap Failed
    </Heading>
    <Text as="p" pb={6} color="#888E8F">
      Please choose an option below
    </Text>
    <Button
      borderRadius={12}
      fontWeight={700}
      fontSize={18}
      onClick={callbacks[0]}
      width="100%"
      mb={4}
    >
      Retry Swap
    </Button>
    <Button
      borderRadius={12}
      fontWeight={700}
      fontSize={18}
      onClick={callbacks[1]}
      width="100%"
      isWireframe
    >
      Widthdraw to Plug
    </Button>
  </Flex>
);
