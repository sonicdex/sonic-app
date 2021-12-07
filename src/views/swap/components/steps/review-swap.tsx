import { FormControl, Checkbox, Box, Image, Flex } from '@chakra-ui/react';

import { TitleBox, TokenBox, Button } from '@/components';
import { arrowDownSrc, infoSrc } from '@/assets';
import {
  setCurrentModalData,
  SwapStep,
  swapViewActions,
  useAppDispatch,
  useModalStore,
  useNotificationStore,
  useSwapViewStore,
} from '@/store';
import { getCurrencyString, parseAmount } from '@/utils/format';
import { Balances } from '@/models';
import { useState } from 'react';
import { MODALS } from '@/modals';
import { useDepositBatch } from '@/integrations/transactions';

type ReviewStepProps = {
  balances?: Balances;
};

export const ReviewStep = ({ balances }: ReviewStepProps) => {
  const { fromTokenOptions, toTokenOptions, from, to } = useSwapViewStore();
  const dispatch = useAppDispatch();
  const {
    setCurrentModal,
    // setCurrentModalData,
    setOnClose,
    setCurrentModalState,
  } = useModalStore();

  const depositBatch = useDepositBatch({
    tokenId: from.token?.id || '',
    amount: parseAmount(from.value, from.token?.decimals || 8),
  });

  const [keepInSonic, setKeepInSonic] = useState<boolean>(false);

  const { addNotification } = useNotificationStore();
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
    setCurrentModalState('deposit');
    setCurrentModal(MODALS.swapProgress);

    console.log('Starting deposit');
    depositBatch.execute().then((res) => {
      console.log('Deposit response', res);
      setCurrentModalState('swap');
    });

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
            tokenOptions={fromTokenOptions}
            currentToken={from.token}
            balance={getCurrencyString(
              from.token && balances ? balances[from.token.id] : 0,
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
            tokenOptions={toTokenOptions}
            currentToken={to.token}
            balance={getCurrencyString(
              to.token && balances ? balances[to.token.id] : 0,
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
