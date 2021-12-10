import { useEffect, useMemo } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

import { TitleBox, TokenBox, Button } from '@/components';
import { getAmountOut, getCurrencyString } from '@/utils/format';

import { arrowDownSrc } from '@/assets';
import {
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useSwapViewStore,
} from '@/store';
import { useBalances } from '@/hooks/use-balances';

export const HomeStep = () => {
  const { fromTokenOptions, toTokenOptions, from, to, pairList } =
    useSwapViewStore();
  const dispatch = useAppDispatch();

  const { totalBalance } = useBalances();

  const handleButtonOnClick = () => {
    if (loading) return;

    dispatch(swapViewActions.setStep(SwapStep.Review));
  };

  const loading = useMemo(() => {
    if (!totalBalance) return true;
    if (!from.token) return true;
    return false;
  }, [totalBalance, from.token]);

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (loading) return [true, 'Loading'];
    if (!totalBalance || !from.token) throw new Error('State is loading');

    if (!to.token) return [true, 'Select a resultant token'];

    const parsedFromValue = (from.value && parseFloat(from.value)) || 0;
    if (parsedFromValue <= 0)
      return [true, `No ${from.token.name} value selected`];
    if (parsedFromValue > totalBalance[from.token.id])
      return [true, `Insufficient ${from.token.name} Balance`];

    return [false, 'Review Swap'];
  }, [loading, totalBalance, from.token, to.token, from.value, to.value]);

  const fromValueStatus = useMemo(() => {
    if (from.value && parseFloat(from.value) > 0) return 'active';
    return 'inactive';
  }, [from.value]);

  useEffect(() => {
    if (!from.token) return;
    if (!to.token) return;
    if (parseFloat(from.value) <= 0) return;
    if (!pairList) return;

    dispatch(
      swapViewActions.setValue({
        data: 'to',
        value: getAmountOut(
          from.value,
          from.token.decimals,
          to.token.decimals,
          String(pairList[from.token.id][to.token.id].reserve0),
          String(pairList[from.token.id][to.token.id].reserve1)
        ),
      })
    );
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
            otherTokensMetadata={fromTokenOptions}
            selectedTokenMetadata={from.token}
            status={fromValueStatus}
            balance={getCurrencyString(
              from.token && totalBalance ? totalBalance[from.token.id] : 0,
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
            otherTokensMetadata={toTokenOptions}
            selectedTokenMetadata={to.token}
            disabled={true}
            balance={getCurrencyString(
              to.token && totalBalance ? totalBalance[to.token.id] : 0,
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
        isLoading={loading}
        isDisabled={buttonDisabled}
      >
        {buttonMessage}
      </Button>
    </>
  );
};
