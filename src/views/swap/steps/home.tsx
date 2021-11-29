import { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { TitleBox, Toggle, TokenBox, Button } from '@/components';

type HomeStepProps = {
  fromValue: string;
  setFromValue: (string) => any;
  toValue: string;
  setToValue: (string) => any;
  fromToken: any;
  setFromToken: (string) => any;
  toToken: any;
  setToToken: (string) => any;
  handleTokenSelect: any;
  nextStep: () => any;
  tokenOptions: object;
};

export const HomeStep = ({
  tokenOptions,
  fromValue,
  setFromValue,
  toValue,
  setToValue,
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  handleTokenSelect,
  nextStep,
}: HomeStepProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Integration: Calculate swap value & fill values
    // adjust setLoading properly
  }, [fromValue, fromToken, toToken]);

  const handleButtonOnClick = () => {
    if (loading) return;

    nextStep();
  };

  const isReady = fromValue && parseFloat(fromValue) > 0;

  const getStatus = (token, value) => (isReady ? 'active' : '');

  return (
    <>
      <TitleBox title="Swap" settings="sd" />
      <Flex direction="column" alignItems="center" mb="20px">
        <Box mt="20px" width="100%">
          <TokenBox
            value={fromValue}
            setValue={setFromValue}
            onTokenSelect={(tokenName) =>
              handleTokenSelect(tokenName, setFromToken)
            }
            tokenOptions={Object.values(tokenOptions)}
            currentToken={fromToken}
            status={getStatus(fromToken, fromValue)}
            balance="0.00"
            amount="0.00"
          />
        </Box>
        <Box
          borderRadius="15px"
          width="42px"
          height="42px"
          border="1px solid #373737"
          py="12px"
          px="13px"
          bg="#1E1E1E"
          mt="-16px"
          mb="-26px"
          zIndex={1200}
        >
          <Box as="img" m="auto" src={'/assets/arrow-down.svg'} />
        </Box>
        <Box mt="10px" width="100%">
          <TokenBox
            value={toValue}
            setValue={setToValue}
            onTokenSelect={(tokenName) =>
              handleTokenSelect(tokenName, setToToken)
            }
            tokenOptions={Object.values(tokenOptions)}
            currentToken={toToken}
            disabled={true}
            balance="0.00"
            amount="0.00"
          />
        </Box>
      </Flex>
      <Button
        onClick={handleButtonOnClick}
        title="Review Swap"
        fontWeight={700}
        fontSize={22}
        borderRadius={20}
        status={loading || !isReady ? 'disabled' : undefined}
      />
    </>
  );
};
