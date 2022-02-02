import { Button, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { StepStatus, useStepStatus } from '@/components/modals';
import {
  getFromStorage,
  LocalStorageKey,
  removeFromStorage,
  saveToStorage,
} from '@/config';
import { useBalances } from '@/hooks/use-balances';
import { Batch } from '@/integrations/transactions';
import { useMintMultipleBatch } from '@/integrations/transactions/hooks/batch/use-mint-multiple-batch';
import {
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';

export interface MintAutoLinkProps {
  id: string;
}

export const MintAutoLink: React.FC<MintAutoLinkProps> = ({ id }) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [step, setStep] = useState<string | Batch.DefaultHookState>(
    Batch.DefaultHookState.Idle
  );

  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { mintWICPUncompleteBlockHeights, mintXTCUncompleteBlockHeights } =
    useModalsStore();

  const getStepStatus = useStepStatus<string>({
    activeStep: step,
    steps,
  });

  const { batch, getTransactionNames } = useMintMultipleBatch({
    blockHeights: {
      WICP: mintWICPUncompleteBlockHeights,
      XTC: mintXTCUncompleteBlockHeights,
    },
  });

  useEffect(() => {
    setStep(batch.state);
  }, [batch.state, dispatch]);

  const handleAutoMint = () => {
    batch
      .execute()
      .then(() => {
        addNotification({
          title: `Minting finished`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });

        removeFromStorage(LocalStorageKey.MintWICPUncompleteBlockHeights);
        removeFromStorage(LocalStorageKey.MintXTCUncompleteBlockHeights);

        getBalances();
        popNotification(id);
      })
      .catch((err) => {
        console.log(step);
        console.error('Minting Error', err);

        const isBlockUsed = err?.message?.includes('BlockUsed');
        const isUnauthorizedError = err?.message?.includes('Unauthorized');
        const isOtherError = err?.message?.includes('Other');

        const errorMessage = isUnauthorizedError
          ? `Block Height entered does not match your address`
          : isOtherError
          ? `Wrap failed, check if the Block Height is correct`
          : isBlockUsed
          ? `Block Height entered is already used`
          : `Wrap failed, please try again later`;

        if (isBlockUsed) {
          // Remove the first (last processed) transaction from the local storage list
          const prevMintWICPBlockHeight = getFromStorage(
            LocalStorageKey.MintWICPUncompleteBlockHeights
          );

          saveToStorage(LocalStorageKey.MintWICPUncompleteBlockHeights, [
            ...(typeof prevMintWICPBlockHeight !== 'undefined'
              ? prevMintWICPBlockHeight.filter(
                  (_: string, index: number) => index !== 0
                )
              : []),
          ]);

          const prevMintXTCBlockHeight = getFromStorage(
            LocalStorageKey.MintXTCUncompleteBlockHeights
          );

          saveToStorage(LocalStorageKey.MintXTCUncompleteBlockHeights, [
            ...(typeof prevMintXTCBlockHeight !== 'undefined'
              ? prevMintXTCBlockHeight.filter(
                  (_: string, index: number) => index !== 0
                )
              : []),
          ]);
          popNotification(id);
        }

        addNotification({
          title: errorMessage,
          type: NotificationType.Error,
          id: Date.now().toString(),
        });
      });

    const transactionNames = getTransactionNames();

    setSteps(transactionNames);
  };

  console.log(step);

  const doneStepColor = useColorModeValue('green.600', 'green.400');
  const activeStepColor = useColorModeValue('gray.600', 'gray.400');
  const disabledStepColor = useColorModeValue('gray.400', 'gray.600');

  return step === Batch.DefaultHookState.Idle ||
    step === Batch.DefaultHookState.Error ? (
    <Button
      colorScheme="dark-blue"
      variant="gradient"
      isFullWidth
      onClick={handleAutoMint}
      mt={3}
    >
      Retry Mint
    </Button>
  ) : (
    <Stack w="full" pt={4}>
      {steps.map((_step) => {
        const stepStatus = getStepStatus(_step);
        const isDoneStep = stepStatus === StepStatus.Done;
        const isActiveStep = stepStatus === StepStatus.Active;
        const isDisabledStep = stepStatus === StepStatus.Disabled;

        const stepColor = isDoneStep
          ? doneStepColor
          : isActiveStep
          ? activeStepColor
          : isDisabledStep
          ? disabledStepColor
          : disabledStepColor;

        const stepLabel = isDoneStep
          ? 'Minted'
          : isActiveStep
          ? 'Minting...'
          : 'Waiting';

        const blockHeight = _step.split('-')[1];

        return (
          <Flex
            key={_step}
            w="full"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text>{blockHeight}</Text>
            <Text color={stepColor}>{stepLabel}</Text>
          </Flex>
        );
      })}
    </Stack>
  );
};
