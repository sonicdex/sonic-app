import { useEffect } from 'react';

import { useBalances } from '@/hooks/use-balances';
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
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();
  const { mintManualTokenSymbol, mintManualBlockHeight } = useModalsStore();

  const { batch } = useMintSingleBatch({
    tokenSymbol: mintManualTokenSymbol,
    blockHeight: mintManualBlockHeight,
  });

  useEffect(() => {
    batch
      .execute()
      .then(() => {
        addNotification({
          title: `Minting finished`,
          type: NotificationType.Success,
          id: Date.now().toString(),
        });

        dispatch(modalsSliceActions.setMintManualBlockHeight(''));
        getBalances();
      })
      .catch((err) => {
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

        dispatch(
          modalsSliceActions.setMintManualModalErrorMessage(errorMessage)
        );
        dispatch(modalsSliceActions.openMintManualModal());
      })
      .finally(() => {
        popNotification(id);
      });
  }, []);

  return null;
};
