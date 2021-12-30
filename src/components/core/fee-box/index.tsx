import { TokenMetadata } from '@/models';
import { getCurrencyString } from '@/utils/format';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

export type FeeBoxProps = {
  token?: TokenMetadata;
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
