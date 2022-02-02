import { Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { Batch } from '@/integrations/transactions';
import { useMintSingleBatch } from '@/integrations/transactions/hooks/batch/use-mint-single-batch';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';

export interface MintManualLinkProps {
  id: string;
}

export const MintManualLink: React.FC<MintManualLinkProps> = ({ id }) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [step, setStep] = useState<string | Batch.DefaultHookState>(
    Batch.DefaultHookState.Idle
  );

  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();
  const { mintManualTokenSymbol, mintManualBlockHeight } = useModalsStore();

  // FIXME: Rewrite to useEffect if needed
  const { batch, getTransactionNames } = useMintSingleBatch({
    tokenSymbol: mintManualTokenSymbol,
    blockHeight: mintManualBlockHeight,
  });

  useEffect(
    () => setSteps(getTransactionNames()),
    [batch.state, dispatch, getTransactionNames]
  );

  useEffect(() => {
    batch
      .execute()
      .then(() => {
        addNotification({
          title: `Minting finished`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });

        dispatch(modalsSliceActions.setMintManualBlockHeight(''));
        getBalances();
      })
      .catch((err) => {
        console.error('Minting Error', err);
        const isUnauthorizedError = err?.message?.includes('Unauthorized');
        const isOtherError = err?.message?.includes('Other');

        addNotification({
          title: isUnauthorizedError
            ? `Transaction index doesn't belongs to your wallet address`
            : isOtherError
            ? `Wrap failed, check block height`
            : `Wrap failed`,
          type: NotificationType.Error,
          id: Date.now().toString(),
        });
      })
      .finally(() => {
        setStep(Batch.DefaultHookState.Idle);
        popNotification(id);
      });

    const transactionNames = getTransactionNames();

    setSteps(transactionNames);
  }, []);

  return (
    <>
      {steps.map((stepName, index) => (
        <Text
          key={stepName}
          color={step === stepName ? 'blue.500' : 'gray.500'}
          fontSize="sm"
          fontWeight={500}
          mb={1}
        >
          {index + 1}. {stepName}
        </Text>
      ))}
    </>
  );
};
