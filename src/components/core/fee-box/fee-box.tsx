import { Flex, Text } from '@chakra-ui/react';
import { toBigNumber } from '@memecake/sonic-js';
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight';
import React, { useMemo } from 'react';

import { AppTokenMetadata } from '@/models';
import {artemis} from '@/integrations/artemis';

export type FeeBoxProps = {
  token?: AppTokenMetadata;
  isDeposit?: boolean;
  isTransfer?: boolean;
};

export const FeeBox: React.FC<FeeBoxProps> = ({ isDeposit = false, token  , isTransfer= false}) => {

  var connectedWalletInfo = artemis.connectedWalletInfo;
  
  const fee = useMemo(() => {
    if (token) {
      return toBigNumber(BigInt(isDeposit ? 2 : 1) * token.fee).applyDecimals(token.decimals).toString();
    }
  }, [isDeposit, token]);

  if (!token) return null;

  return (
    <Flex opacity={0.5} alignItems="center" px={4} fontWeight={400} mb={5}>
      {!isTransfer?(
      <Text display="flex" alignItems="center">
        {isDeposit ? connectedWalletInfo.name : 'Sonic'}&nbsp;
        <FaArrowRight />
        &nbsp;{isDeposit ? 'Sonic' : connectedWalletInfo.name}
      </Text>):
      (<Text display="flex" alignItems="center">From {connectedWalletInfo.name}</Text>)
      }
      
      <Text flex={1} textAlign="right" mx={2}>
        {token.symbol}&nbsp;Fee =&nbsp;
        {fee}
        &nbsp;{token.symbol}
      </Text>
    </Flex>
  );
};
