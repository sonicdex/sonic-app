import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

import { redTriangleWarningSrc } from '@/assets';

import { ImportTokenImage } from './import-token-image';

type ImportTokenProps = {
  logo?: string;
  id: string;
  symbol: string;
  name: string;
  handleImport: (arg0?: any) => any;
};

export const ImportToken = ({
  logo,
  id,
  symbol,
  name,
  handleImport,
}: ImportTokenProps) => {
  const [understandRisk, setUnderstandRisk] = useState(false);

  return (
    <Flex direction="column" width="100%" alignItems="center">
      <Heading as="h1" fontWeight={700} fontSize={18} mb={6}>
        Import Token
      </Heading>
      <ImportTokenImage logo={logo} />
      <Text mt={2} fontSize={18} fontWeight={700} color="gray.50">
        {symbol}
      </Text>
      <Text color="custom.1">{name}</Text>
      <Flex
        mt={5}
        mb={6}
        py={3}
        w="100%"
        bg="custom.3"
        borderRadius={20}
        justifyContent="center"
        alignItems="center"
        direction="row"
      >
        <Text color="gray.50">{id}</Text>
      </Flex>
      <Box
        position="relative"
        bg="rgba(229, 130, 121, 0.1)"
        borderRadius={20}
        mb={6}
        pt={4}
        px={5}
        pb={5}
      >
        <Image
          alt="warning"
          src={redTriangleWarningSrc}
          w={6}
          position="absolute"
          top={4}
          right={5}
        />
        <Text fontSize={18} color="#E58279" fontWeight={700} mb={2}>
          Trade at your own risk!
        </Text>
        <Text color="gray.50">
          Swapping from ICP to WICP is not reccomended at this moment due to the
          IC restriction. Swapping from WICP to ICP is only allowed on Sonic P2P
          market.
        </Text>
      </Box>
      <Checkbox
        isChecked={understandRisk}
        alignSelf="flex-start"
        onChange={(e) => setUnderstandRisk(e.target.checked)}
        size="lg"
        color="gray.50"
        fontWeight={600}
        mb={6}
      >
        I understand the risk of trading this token
      </Checkbox>
      <Button
        variant="gradient"
        colorScheme="dark-blue"
        w="100%"
        borderRadius={12}
        fontSize={18}
        fontWeight={700}
        onClick={handleImport}
        disabled={!understandRisk}
      >
        Import Token
      </Button>
    </Flex>
  );
};
