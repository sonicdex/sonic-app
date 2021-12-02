import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import { TOKEN } from '@/constants';
import { SupportedToken } from '@/models';

type DepositStepProps = {
  token: Partial<SupportedToken>;
  onArrowBack: () => any;
};

export const DepositStep = ({ token, onArrowBack }: DepositStepProps) => {
  const [currentToken, setCurrentToken] = useState(token);
  const [value, setValue] = useState('0');

  const isReady = value && parseFloat(value) > 0;
  const getStatus = () => (isReady ? 'active' : '');

  const handleTokenSelect = (tokenName: string) => {
    setCurrentToken(TOKEN[tokenName]);
  };

  const handleDeposit = () => {
    // Integration:
    // Deposit token to Sonic
  };

  return (
    <>
      <TitleBox title="Deposit Asset" onArrowBack={onArrowBack} />
      <Box my="20px">
        <TokenBox
          value={value}
          setValue={setValue}
          onTokenSelect={handleTokenSelect}
          source="plug"
          balance="23.23"
          amount="53.23"
          status={getStatus()}
          // TODO: Fix types
          tokenOptions={Object.values(TOKEN) as SupportedToken[]}
          currentToken={currentToken as SupportedToken}
        />
      </Box>
      <Button
        title="Deposit"
        status={isReady ? undefined : 'disabled'}
        onClick={handleDeposit}
        borderRadius={20}
        fontWeight={700}
        fontSize={22}
      />
    </>
  );
};
