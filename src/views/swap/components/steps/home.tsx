import { useMemo } from 'react';
import { Box, Icon, Flex, IconButton, Tooltip } from '@chakra-ui/react';

import { TitleBox, TokenBox, Button } from '@/components';
import { getCurrencyString } from '@/utils/format';

import {
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useSwapViewStore,
} from '@/store';
import { useTotalBalances } from '@/hooks/use-balances';
import { FaArrowDown } from 'react-icons/fa';

export const HomeStep = () => {
  const { fromTokenOptions, toTokenOptions, from, to } = useSwapViewStore();
  const dispatch = useAppDispatch();

  const { totalBalances: totalBalance } = useTotalBalances();

  const handleButtonOnClick = () => {
    if (loading) return;

    dispatch(swapViewActions.setStep(SwapStep.Review));
  };

  const loading = useMemo(() => {
    if (!totalBalance) return true;
    if (!from.token) return true;
    if (!to.token) return true;
    return false;
  }, [totalBalance, from.token, to.token]);

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (loading) return [true, 'Loading'];
    if (!totalBalance || !from.token || !to.token)
      throw new Error('State is loading');

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

  const switchTokens = () => {
    dispatch(swapViewActions.switchTokens());
  };

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
            isLoading={loading}
          />
        </Box>
        <Tooltip label="Swap">
          <IconButton
            aria-label="Swap"
            icon={<Icon as={FaArrowDown} transition="transform 250ms" />}
            variant="outline"
            mt={-4}
            mb={-6}
            zIndex="overlay"
            bg="gray.800"
            onClick={switchTokens}
            _hover={{
              '& > svg': {
                transform: 'rotate(180deg)',
              },
            }}
          />
        </Tooltip>
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
            isLoading={loading}
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
