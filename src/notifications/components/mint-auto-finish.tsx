import { Button } from '@chakra-ui/react';
import { useEffect } from 'react';

import { LocalStorageKey, removeFromStorage } from '@/config';
import { useBalances } from '@/hooks/use-balances';
import { useMintMultipleBatch } from '@/integrations/transactions/hooks/batch/use-mint-multiple-batch';
import {
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';

export interface MintAutoFinishLinkProps {
  id: string;
}

export const MintAutoFinishLink: React.FC<MintAutoFinishLinkProps> = ({
  id,
}) => {
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const { mintWICPUncompleteBlockHeights, mintXTCUncompleteBlockHeights } =
    useModalsStore();

  // FIXME: Rewrite to useEffect if needed
  const { batch, startMinting } = useMintMultipleBatch({
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

        removeFromStorage(LocalStorageKey.MintWICPUncompleteBlockHeights);
        removeFromStorage(LocalStorageKey.MintXTCUncompleteBlockHeights);

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
