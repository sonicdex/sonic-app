import { useState, useEffect, useMemo } from 'react';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Integration: Calculate swap value & fill values
    // adjust setLoading properly
    console.log(setLoading);
  }, [fromValue, fromToken, toToken]);

  const handleButtonOnClick = () => {
    if (loading) return;

    nextStep();
  };

  const [buttonStatus, buttonMessage] = useMemo<
    ['disabled' | 'grey-disabled' | undefined, string]
  >(() => {
    if (loading) return ['disabled', 'Loading'];
    if (!balances) return ['disabled', 'No balances found'];
    if (!fromToken) return ['disabled', 'No from token selected'];
    if (!toToken) return ['disabled', 'No to token selected'];

    const parsedFromValue = (fromValue && parseFloat(fromValue)) || 0;
    if (parsedFromValue <= 0) return ['disabled', 'No from value selected'];
    if (parsedFromValue > balances[fromToken.id])
      return ['disabled', `Insufficient ${fromToken.name} Balance`];

    return [undefined, 'Review Swap'];
  }, [loading, balances, fromToken, toToken, fromValue, toValue]);

  const fromValueStatus = useMemo(() => {
    if (fromValue && parseFloat(fromValue) > 0) return 'active';
    return 'inactive';
  }, [fromValue]);

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
            status={fromValueStatus}
            balance={getCurrencyString(
              fromToken && balances ? balances[fromToken.id] : 0,
              fromToken?.decimals
            )}
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
          <Image m="auto" src={arrowDownSrc} />
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
            balance={getCurrencyString(
              toToken && balances ? balances[toToken.id] : 0,
              toToken?.decimals
            )}
            amount="0.00"
          />
        </Box>
      </Flex>
      <Button
        onClick={handleButtonOnClick}
        title={buttonMessage}
        fontWeight={700}
        fontSize={22}
        borderRadius={20}
        status={buttonStatus}
      />
    </>
  );
};
