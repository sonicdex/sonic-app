import { useEffect } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useMintSingleBatch } from '@/integrations/transactions/hooks/batch/use-mint-single-batch';
import { useMintErrorHandler } from '@/integrations/transactions/hooks/use-mint-error-handler';
import {
  modalsSliceActions, NotificationType, useAppDispatch, useModalsStore, useNotificationStore,
} from '@/store';

export interface MintManualNotificationContentProps {
  id: string;
}

export const MintManualNotificationContent: React.FC<
  MintManualNotificationContentProps
> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();
  const { mintManualTokenSymbol, mintManualBlockHeight } = useModalsStore();
  const handleMintError = useMintErrorHandler({ notificationId: id });

  const batchData = useMintSingleBatch({ tokenSymbol: mintManualTokenSymbol, blockHeight: mintManualBlockHeight });

  const batch = batchData?.batch
  const batchExecutalbe = batch?.batchExecute;
  const batchFnUpdate = batch.batchFnUpdate;


  useEffect(() => {
    if (batchExecutalbe?.execute) {
      batchExecutalbe.execute().then((data: any) => {
        if(data){
          getBalances()
          addNotification({ title: `Minting finished`, type: NotificationType.Success, id: Date.now().toString()});
        }else{
          addNotification({ title: `Minting Failed`, type: NotificationType.Error, id: Date.now().toString()});
        }
      }).catch((err:any)=>{
          handleMintError(err.message, (errorMessage) => { dispatch( modalsSliceActions.setMintManualModalErrorMessage(errorMessage));
          dispatch(modalsSliceActions.openMintManualModal());
        })
      }).finally(() => popNotification(id));;
    } else {
      
    }
  }, [batchFnUpdate])


  // useEffect(() => {
  //   batch
  //     .execute()
  //     .then(() => {
  //       addNotification({
  //         title: `Minting finished`,
  //         type: NotificationType.Success,
  //         id: Date.now().toString(),
  //       });

  //       dispatch(modalsSliceActions.setMintManualBlockHeight(''));
  //       getBalances();
  //     })
  //     .catch((err) =>
  //       handleMintError(err.message, (errorMessage) => {
  //         dispatch(
  //           modalsSliceActions.setMintManualModalErrorMessage(errorMessage)
  //         );
  //         dispatch(modalsSliceActions.openMintManualModal());
  //       })
  //     )
  //     .finally(() => popNotification(id));
  // }, []);

  return null;
};
