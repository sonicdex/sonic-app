import { arrowDownSrc, infoSrc } from '@/assets';
import { Button, TitleBox, TokenBox } from '@/components';
import { useDepositSwapBatch } from '@/integrations/transactions';
import { MODALS } from '@/modals';
import {
  setCurrentModalData,
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useModalStore,
  useNotificationStore,
  useSwapViewStore,
} from '@/store';
import { getCurrencyString } from '@/utils/format';
import { useEffect, useState } from 'react';
import { useBalances } from '@/hooks/use-balances';
import { Box, Flex } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { FormControl } from '@chakra-ui/form-control';
import { Checkbox } from '@chakra-ui/checkbox';

export const ReviewStep = () => {
  const { totalBalance } = useBalances();
  const { fromTokenOptions, toTokenOptions, from, to } = useSwapViewStore();
  const dispatch = useAppDispatch();
  const {
    setCurrentModal,
    // setCurrentModalData,
    setOnClose,
    setCurrentModalState,
  } = useModalStore();

  const [keepInSonic, setKeepInSonic] = useState<boolean>(false);

  const { addNotification } = useNotificationStore();

  const depositSwapBatch = useDepositSwapBatch({
    from,
    to,
    slippage: 0.1,
  });

  const handleApproveSwap = () => {
    if (!from.token || !to.token) return;
    // Integration: Do swap
    // trigger modals.
    addNotification({
      title: 'NOTIFICATION',
      type: 'done',
      id: Date.now().toString(),
    });
    setOnClose(() => {
      console.log('Closed Modal');
    });
    setCurrentModalData({ fromToken: from.token.name, toToken: to.token.name });
    setCurrentModal(MODALS.swapProgress);

    console.log('Starting deposit');
    depositSwapBatch
      .execute()
      .then((res) => console.log('success', res))
      .catch((err) => console.log('error', err));

    // TODO: Remove after integration with batch transactions
    // TODO: Refactor in case OnClose is called to stop all effects
    // setTimeout(() => setCurrentModalState('swap'), 3000);
    // setTimeout(() => setCurrentModalState('withdraw'), 6000);
    // setTimeout(() => {
    //   clearModal();
    //   addNotification({
    //     title: 'NOTIFICATION',
    //     type: 'done',
    //     id: Date.now().toString(),
    //   });
    // }, 9000);
  };

  useEffect(() => {
    switch (depositSwapBatch.state) {
      case 'approve':
      case 'deposit':
        setCurrentModalState('deposit');
        break;
      case 'swap':
        setCurrentModalState('swap');
        break;
    }
  }, [depositSwapBatch.state]);

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
            onTokenSelect={(tokenId) => {
              dispatch(swapViewActions.setToken({ data: 'from', tokenId }));
            }}
            otherTokensMetadata={fromTokenOptions}
            selectedTokenMetadata={from.token}
            balance={getCurrencyString(
              from.token && totalBalance ? totalBalance[from.token.id] : 0,
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
            onTokenSelect={(tokenId) => {
              dispatch(swapViewActions.setToken({ data: 'to', tokenId }));
            }}
            otherTokensMetadata={toTokenOptions}
            selectedTokenMetadata={to.token}
            balance={getCurrencyString(
              to.token && totalBalance ? totalBalance[to.token.id] : 0,
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
