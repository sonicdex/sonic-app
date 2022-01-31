import { Button } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useFinishMintBatch } from '@/integrations/transactions/factories/batch/finish-mint';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';

export interface FinishMintLinkProps {
  id: string;
}

export const FinishMintLink: React.FC<FinishMintLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { mintWICPUncompleteBlockHeights, mintXTCUncompleteBlockHeights } =
    useModalsStore();

  // FIXME: Rewrite to useEffect if needed
  const { batch, startMinting } = useFinishMintBatch({
    blockHeights: {
      WICP: mintWICPUncompleteBlockHeights,
      XTC: mintXTCUncompleteBlockHeights,
    },
  });

  const handleStateChange = () => {
    dispatch(
      modalsSliceActions.setFinishMintData({
        step: batch.state,
      })
    );
  };

  useEffect(handleStateChange, [batch.state, dispatch]);

  const handleFinishMint = () => {
    batch
      .execute()
      .then(() => {
        dispatch(modalsSliceActions.setFinishMintData());
        dispatch(modalsSliceActions.endFinishMinting());
        addNotification({
          title: `Minting finished`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
        getBalances();
      })
      .catch((err) => {
        console.error('Minting Error', err);
        dispatch(modalsSliceActions.setFinishMintData());
        addNotification({
          title: `Minting failed`,
          type: NotificationType.Error,
          id: Date.now().toString(),
        });
      })
      .finally(() => popNotification(id));

    startMinting();
  };

  return (
    <Button
      colorScheme="dark-blue"
      variant="gradient"
      isFullWidth
      onClick={handleFinishMint}
      mt={3}
    >
      Retry Mint
    </Button>
  );
};
