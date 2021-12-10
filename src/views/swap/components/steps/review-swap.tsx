import { arrowDownSrc, infoSrc } from '@/assets';
import { Button, TitleBox, TokenBox } from '@/components';
import { useTotalBalances } from '@/hooks/use-balances';
import { useSwapBatch } from '@/integrations/transactions';
import { MODALS } from '@/modals';
import { TokenDataKey } from '@/models';
import {
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useModalStore,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';
import { getCurrencyString } from '@/utils/format';
import { createCAPLink } from '@/utils/function';
import { Box, Checkbox, Flex, FormControl, Image } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

export const ReviewStep = () => {
  const { totalBalances } = useTotalBalances();
  const { fromTokenOptions, toTokenOptions, from, to } = useSwapViewStore();
  const { principalId } = usePlugStore();
  const dispatch = useAppDispatch();
  const {
    setCurrentModal,
    setCurrentModalData,
    setCurrentModalState,
    clearModal,
  } = useModalStore();

  const [keepInSonic, setKeepInSonic] = useState<boolean>(false);
  const { addNotification } = useNotificationStore();

  const depositSwapBatch = useSwapBatch({
    from,
    to,
    slippage: 0.1,
    keepInSonic,
    principalId,
  });

  const handleTokenSelect = (data: TokenDataKey, tokenId: string) => {
    dispatch(swapViewActions.setToken({ data, tokenId }));
  };

  const handleApproveSwap = () => {
    // Integration: Do swap
    // trigger modals.
    setCurrentModalData({
      fromToken: from.token?.name,
      toToken: to.token?.name,
    });
    setCurrentModalState('deposit');
    setCurrentModal(MODALS.swapProgress);

    depositSwapBatch
      .execute()
      .then((res) => {
        console.log('Swap Completed', res);
        clearModal();
        addNotification({
          title: `Swapped ${from.value} ${from.token?.symbol} for ${to.value} ${to.token?.symbol}`,
          type: 'done',
          id: Date.now().toString(),
          // TODO: add transaction id
          transactionLink: createCAPLink('transactionId'),
        });
        dispatch(swapViewActions.setValue({ data: 'from', value: '0.00' }));
      })
      .catch((err) => {
        console.error('Swap Error', err);
        setCurrentModal(MODALS.swapFailed);
      });
  };

  useEffect(() => {
    switch (depositSwapBatch.state as any) {
      case 'approve':
      case 'deposit':
        setCurrentModalState('deposit');
        break;
      case 'swap':
        setCurrentModalState('swap');
        break;
      case 'withdraw':
        setCurrentModalState('withdraw');
        break;
    }
  }, [depositSwapBatch.state]);

  const selectedTokenIds = useMemo(() => {
    let selectedIds = [];
    if (from?.token?.id) selectedIds.push(from.token.id);
    if (to?.token?.id) selectedIds.push(to.token.id);

    return selectedIds;
  }, [from?.token?.id, to?.token?.id]);

  return (
    <>
      <TitleBox
        title="Swap"
        settings="sd"
        onArrowBack={() => dispatch(swapViewActions.setStep(SwapStep.Home))}
      />
      <Flex direction="column" alignItems="center" mb={5}>
        <Box mt={5} width="100%">
          <TokenBox
            value={from.value}
            setValue={(value) =>
              dispatch(swapViewActions.setValue({ data: 'from', value }))
            }
            otherTokensMetadata={fromTokenOptions}
            selectedTokenMetadata={from.token}
            selectedTokenIds={selectedTokenIds}
            onTokenSelect={(tokenId) => handleTokenSelect('from', tokenId)}
            balance={getCurrencyString(
              from.token && totalBalances ? totalBalances[from.token.id] : 0,
              from.token?.decimals
            )}
            amount="0.00"
            status="active"
          />
        </Box>
        <Box
          borderRadius={4}
          width={10}
          height={10}
          py={3}
          px={3}
          bg="#3D52F4"
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
            otherTokensMetadata={toTokenOptions}
            selectedTokenMetadata={to.token}
            selectedTokenIds={selectedTokenIds}
            onTokenSelect={(tokenId) => handleTokenSelect('to', tokenId)}
            balance={getCurrencyString(
              to.token && totalBalances ? totalBalances[to.token.id] : 0,
              to.token?.decimals
            )}
            status="active"
            amount="0.00"
            glow
            disabled
          />
        </Box>
      </Flex>
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        borderRadius={5}
        mb={5}
        bg="#1E1E1E"
        px={5}
        py={4}
      >
        <FormControl direction="row" alignItems="center">
          <Checkbox
            isChecked={keepInSonic}
            onChange={(e) => setKeepInSonic(e.target.checked)}
            colorScheme="dark-blue"
            size="lg"
            color={keepInSonic ? '#FFFFFF' : '#888E8F'}
            fontWeight={600}
          >
            Keep tokens in Sonic after swap
          </Checkbox>
        </FormControl>
        <Image
          src={infoSrc}
          width={5}
          transition="opacity 200ms"
          opacity={keepInSonic ? 1 : 0.5}
        />
      </Flex>
      <Button isFullWidth size="lg" onClick={handleApproveSwap}>
        Confirm Swap
      </Button>
    </>
  );
};
