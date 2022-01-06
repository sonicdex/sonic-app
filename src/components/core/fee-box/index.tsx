import { Flex, Text } from '@chakra-ui/react';
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight';
import React from 'react';

import { AppTokenMetadata } from '@/models';
import { getCurrencyString } from '@/utils/format';

export type FeeBoxProps = {
  token?: AppTokenMetadata;
  isDeposit?: boolean;
};

export const FeeBox: React.FC<FeeBoxProps> = ({ isDeposit = false, token }) => {
  if (!token) return null;

  return (
    <Flex opacity={0.4} alignItems="center" px={4} fontWeight={400} mb={5}>
      <Text display="flex" alignItems="center">
        {isDeposit ? 'Plug' : 'Sonic'}&nbsp;
        <FaArrowRight />
        &nbsp;{isDeposit ? 'Sonic' : 'Plug'}
      </Text>
      <Text flex={1} textAlign="right" mx={2}>
        Network Fee:&nbsp;
        {getCurrencyString(token.fee, token.decimals)}
        &nbsp;{token.symbol}
      </Text>
    </Flex>
  );
};
