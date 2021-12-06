import { useMemo } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

import { TitleBox, TokenBox, Button } from '@/components';
import { Balances, SupportedToken } from '@/models';
import { getCurrencyString } from '@/utils/format';

import { arrowDownSrc } from '@/assets';

type HomeStepProps = {
  fromValue: string;
  toValue: string;
  fromToken?: SupportedToken;
  toToken?: SupportedToken;
  tokenOptions: object;
  balances?: Balances;
  setFromValue: (value: string) => any;
  setToValue: (value: string) => any;
  setFromToken?: (token: SupportedToken) => any;
  setToToken?: (token: SupportedToken) => any;
  handleTokenSelect: (...args: any[]) => any;
  nextStep: () => any;
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
  balances,
}: HomeStepProps) => {
  const handleButtonOnClick = () => {
    if (loading) return;

    nextStep();
  };

  const loading = useMemo(() => {
    if (!balances) return true;
    if (!fromToken) return true;
    if (!toToken) return true;
    return false;
  }, [balances, fromToken, toToken]);

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (loading) return [true, 'Loading'];
    if (!balances || !fromToken || !toToken)
      throw new Error('State is loading');

    const parsedFromValue = (fromValue && parseFloat(fromValue)) || 0;
    if (parsedFromValue <= 0)
      return [true, `No ${fromToken.name} value selected`];
    if (parsedFromValue > balances[fromToken.id])
      return [true, `Insufficient ${fromToken.name} Balance`];

    return [false, 'Review Swap'];
  }, [loading, balances, fromToken, toToken, fromValue, toValue]);

  const fromValueStatus = useMemo(() => {
    if (fromValue && parseFloat(fromValue) > 0) return 'active';
    return 'inactive';
  }, [fromValue]);

  return (
    <>
      <TitleBox title="Swap" settings="sd" />
      <Flex direction="column" alignItems="center" mb={5}>
        <Box mt={5} width="100%">
          <TokenBox
            value={fromValue}
            setValue={setFromValue}
            onTokenSelect={(tokenName) =>
              handleTokenSelect(tokenName, setFromToken)
            }
            tokenOptions={Object.values(tokenOptions)}
            currentToken={fromToken}
            status={fromValueStatus}
            balance={getCurrencyString(
              fromToken && balances ? balances[fromToken.id] : 0,
              fromToken?.decimals
            )}
            amount="0.00"
          />
        </Box>
        <Box
          borderRadius={4}
          width={10}
          height={10}
          border="1px solid #373737"
          py={3}
          px={3}
          bg="#1E1E1E"
          mt={-4}
          mb={-6}
          zIndex={1200}
        >
          <Image m="auto" src={arrowDownSrc} />
        </Box>
        <Box mt={2.5} width="100%">
          <TokenBox
            value={toValue}
            setValue={setToValue}
            onTokenSelect={(tokenName) =>
              handleTokenSelect(tokenName, setToToken)
            }
            tokenOptions={Object.values(tokenOptions)}
            currentToken={toToken}
            disabled={true}
            balance={getCurrencyString(
              toToken && balances ? balances[toToken.id] : 0,
              toToken?.decimals
            )}
            amount="0.00"
          />
        </Box>
      </Flex>
      <Button
        isFullWidth
        size="lg"
        onClick={handleButtonOnClick}
        fontWeight={700}
        fontSize={22}
        borderRadius={20}
        isLoading={loading}
        isDisabled={buttonDisabled}
      >
        {buttonMessage}
      </Button>
    </>
  );
};
