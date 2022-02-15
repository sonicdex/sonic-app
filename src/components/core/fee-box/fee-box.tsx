import { Flex, Text } from '@chakra-ui/react';
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight';
import React, { useMemo } from 'react';

import { AppTokenMetadata } from '@/models';
import { getAmountDividedByDecimals } from '@/utils/format';

export type FeeBoxProps = {
  token?: AppTokenMetadata;
  isDeposit?: boolean;
};

export const FeeBox: React.FC<FeeBoxProps> = ({ isDeposit = false, token }) => {
  const fee = useMemo(() => {
    if (token) {
      if (isDeposit) {
        return getAmountDividedByDecimals(
          BigInt(2) * token.fee,
          token.decimals
        ).toString();
      } else {
        return getAmountDividedByDecimals(token.fee, token.decimals).toString();
      }
    }
  }, [isDeposit, token]);

  if (!token) return null;

  return (
    <Flex opacity={0.5} alignItems="center" px={4} fontWeight={400} mb={5}>
      <Text display="flex" alignItems="center">
        {isDeposit ? 'Plug' : 'Sonic'}&nbsp;
        <FaArrowRight />
        &nbsp;{isDeposit ? 'Sonic' : 'Plug'}
      </Text>
      <Text flex={1} textAlign="right" mx={2}>
        {token.symbol}&nbsp;Fee =&nbsp;
        {fee}
        &nbsp;{token.symbol}
      </Text>
    </Flex>
  );
};
