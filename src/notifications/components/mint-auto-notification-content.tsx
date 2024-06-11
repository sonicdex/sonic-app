import { Button, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

import { StepStatus, useStepStatus } from '@/components/modals';
import { useBalances } from '@/hooks/use-balances';
import { Batch } from '@/integrations/transactions';
import { useMintMultipleBatch } from '@/integrations/transactions/hooks/batch/use-mint-multiple-batch';
import { useMintErrorHandler } from '@/integrations/transactions/hooks/use-mint-error-handler';
import {
  addNotification,
  NotificationState,
  NotificationType,
  setNotificationData,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { LocalStorageKey, removeFromStorage } from '@/utils';

export type MintAutoNotificationContentProps = {
  id: string;
  state?: NotificationState;
};

export const MINT_AUTO_NOTIFICATION_TITLES = {
  [NotificationState.Pending]: 'Minting in progress',
  [NotificationState.Success]: 'Mint was successful',
  [NotificationState.Error]:
    'You have unfinished or failed mint(s), click retry mint below.',
};

export const MintAutoNotificationContent: React.FC<
  MintAutoNotificationContentProps
> = ({ id, state }) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [step, setStep] = useState<string | Batch.DefaultHookState>(
    Batch.DefaultHookState.Idle
  );

  const dispatch = useAppDispatch();

  const { getBalances } = useBalances();

  const handleMintError = useMintErrorHandler({ notificationId: id });

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
    dispatch(
      setNotificationData({
        data: {
          state: NotificationState.Pending,
          title: MINT_AUTO_NOTIFICATION_TITLES[NotificationState.Pending],
        },
        id,
      })
    );

    batch
      .execute()
      .then(() => {
        dispatch(
          addNotification({
            title: `Minting finished`,
            type: NotificationType.Success,
            id: Date.now().toString(),
          })
        );

        removeFromStorage(LocalStorageKey.MintWICPUncompleteBlockHeights);
        removeFromStorage(LocalStorageKey.MintXTCUncompleteBlockHeights);

        getBalances();
        dispatch(
          setNotificationData({
            data: {
              state: NotificationState.Success,
              title: MINT_AUTO_NOTIFICATION_TITLES[NotificationState.Success],
            },
            id,
          })
        );
      })
      .catch((err) =>
        handleMintError(err.message, (errorMessage) => {
          dispatch(
            setNotificationData({
              data: {
                state: NotificationState.Error,
                title: MINT_AUTO_NOTIFICATION_TITLES[NotificationState.Error],
              },
              id,
            })
          );
          dispatch(
            addNotification({
              title: errorMessage,
              type: NotificationType.Error,
              id: Date.now().toString(),
            })
          );
        })
      );

    const transactionNames = getTransactionNames();

    setSteps(transactionNames);
  };

  const doneStepColor = useColorModeValue('green.600', 'green.400');
  const activeStepColor = useColorModeValue('gray.600', 'gray.400');
  const disabledStepColor = useColorModeValue('gray.400', 'gray.600');

  const shouldShowRetryButton = useMemo(() => {
    return (
      step === Batch.DefaultHookState.Idle ||
      step === Batch.DefaultHookState.Error ||
      state === NotificationState.Error
    );
  }, [step, state]);

  return shouldShowRetryButton ? (
    <Button
      colorScheme="green"
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

        const stepLabel = isDisabledStep
          ? 'Waiting'
          : isActiveStep
          ? 'Minting...'
          : 'Done';

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
