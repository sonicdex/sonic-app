import { Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

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

  console.log('auto', step, steps);

  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { mintWICPUncompleteBlockHeights, mintXTCUncompleteBlockHeights } =
    useModalsStore();

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
      })
      .catch((err) => {
        console.error('Minting Error', err);
        setStep(Batch.DefaultHookState.Idle);
        addNotification({
          title: `Minting failed`,
          type: NotificationType.Error,
          id: Date.now().toString(),
        });
      })
      .finally(() => popNotification(id));

    const transactionNames = getTransactionNames();

    setSteps(transactionNames);
  };

  return (
    <>
      <Button
        colorScheme="dark-blue"
        variant="gradient"
        isFullWidth
        onClick={handleAutoMint}
        mt={3}
      >
        Retry Mint
      </Button>
    </>
  );
};
