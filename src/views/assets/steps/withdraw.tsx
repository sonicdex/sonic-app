import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import {
  InformationBox,
  TitleBox,
  TokenBox,
  Button,
} from '@/components';

import { ASSETS } from '@/constants';

type Token = {
  name: string,
  img: string, 
};

type WithdrawStepProps = {
  token: Token,
  onArrowBack: () => any,
};

export const WithdrawStep = ({
  token,
  onArrowBack,
}: WithdrawStepProps) => {
  const [currentToken, setCurrentToken] = useState(token);
  const [value, setValue] = useState('0');

  const isReady = value && parseFloat(value) > 0;
  const getStatus = () => isReady ? 'active' : '';

  const handleTokenSelect = (tokenName) => {
    setCurrentToken(ASSETS[tokenName]);
  }

  const handleWithdraw = () => {
    // Integration:
    // Deposit token to Sonic
  }

  return (
    <>
      <TitleBox
        title="Withdraw Asset"
        onArrowBack={onArrowBack}
      />
      <Box my="20px">
        <TokenBox
          value={value}
          setValue={setValue}
          onTokenSelect={handleTokenSelect}
          source="sonic"
          balance="23.23"
          amount="53.23"
          status={getStatus()}
          tokenOptions={Object.values(ASSETS)}
          currentToken={currentToken}
        />
      </Box>
      <Button
        title="Withdraw"
        status={isReady ? undefined : 'disabled'}
        onClick={handleWithdraw}
        borderRadius={20}
        fontWeight={700}
        fontSize={22}
      />
    </>
  );
}
