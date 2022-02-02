import { Button, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { StepStatus, useStepStatus } from '@/components/modals';
import { LocalStorageKey, removeFromStorage } from '@/config';
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

  // FIXME: Rewrite to useEffect if needed
  const { batch, getTransactionNames } = useMintMultipleBatch({
    blockHeights: {
      WICP: mintWICPUncompleteBlockHeights,
      XTC: mintXTCUncompleteBlockHeights,
    },
  });

  const handleStateChange = () => {
    setStep(batch.state);
  };

  useEffect(handleStateChange, [batch.state, dispatch]);

  const handleAutoMint = () => {
    batch
      .execute()
      .then(() => {
        setStep(Batch.DefaultHookState.Idle);

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
        console.error('Minting Error', err);
        setStep(Batch.DefaultHookState.Idle);
        addNotification({
          title: `Minting failed`,
          type: NotificationType.Error,
          id: Date.now().toString(),
        });
      });

    const transactionNames = getTransactionNames();

    setSteps(transactionNames);
  };

  const doneStepColor = useColorModeValue('green.600', 'green.400');
  const activeStepColor = useColorModeValue('blue.600', 'blue.400');
  const disabledStepColor = useColorModeValue('gray.600', 'gray.400');

  return step === Batch.DefaultHookState.Idle ? (
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
    <Stack w="full">
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
            pt={4}
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
