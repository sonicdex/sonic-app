import { useEffect, useMemo } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

import { TitleBox, TokenBox, Button } from '@/components';
import { Balances } from '@/models';
import { getCurrencyString } from '@/utils/format';

import { arrowDownSrc } from '@/assets';
import {
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useSwapViewStore,
} from '@/store';

type HomeStepProps = {
  balances?: Balances;
};

export const HomeStep = ({ balances }: HomeStepProps) => {
  const { fromTokenOptions, toTokenOptions, from, to } = useSwapViewStore();
  const dispatch = useAppDispatch();

  const handleButtonOnClick = () => {
    if (loading) return;

    dispatch(swapViewActions.setStep(SwapStep.Review));
  };

  const loading = useMemo(() => {
    if (!balances) return true;
    if (!from.token) return true;
    if (!to.token) return true;
    return false;
  }, [balances, from.token, to.token]);

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (loading) return [true, 'Loading'];
    if (!balances || !from.token || !to.token)
      throw new Error('State is loading');

    const parsedFromValue = (from.value && parseFloat(from.value)) || 0;
    if (parsedFromValue <= 0)
      return [true, `No ${from.token.name} value selected`];
    if (parsedFromValue > balances[from.token.id])
      return [true, `Insufficient ${from.token.name} Balance`];

    return [false, 'Review Swap'];
  }, [loading, balances, from.token, to.token, from.value, to.value]);

  const fromValueStatus = useMemo(() => {
    if (from.value && parseFloat(from.value) > 0) return 'active';
    return 'inactive';
  }, [from.value]);

  useEffect(() => {
    if (from.token && parseFloat(from.value) > 0) {
      // TODO: find correct way to update to.value
      dispatch(
        swapViewActions.setValue({
          data: 'to',
          value: String(Number(from.value) * (1 - Number(from.token.fee))),
        })
      );
    }
  }, [from.value]);

  return (
    <>
      <TitleBox title="Swap" settings="sd" />
      <Flex direction="column" alignItems="center" mb={5}>
        <Box mt={5} width="100%">
          <TokenBox
            value={from.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'from', value }))
            }
            onTokenSelect={(tokenId) => {
              dispatch(swapViewActions.setToken({ data: 'from', tokenId }));
            }}
            tokenOptions={fromTokenOptions}
            currentToken={from.token}
            status={fromValueStatus}
            balance={getCurrencyString(
              from.token && balances ? balances[from.token.id] : 0,
              from.token?.decimals
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
            value={to.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'to', value }))
            }
            onTokenSelect={(tokenId) => {
              dispatch(swapViewActions.setToken({ data: 'to', tokenId }));
            }}
            tokenOptions={toTokenOptions}
            currentToken={to.token}
            disabled={true}
            balance={getCurrencyString(
              to.token && balances ? balances[to.token.id] : 0,
              to.token?.decimals
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
