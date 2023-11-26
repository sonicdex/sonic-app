import { Link } from '@chakra-ui/react';
import { deserialize, serialize } from '@sonicdex/sonic-js';
import { useEffect, useMemo } from 'react';
import { useBalances } from '@/hooks/use-balances';

import { useTokenAllowance } from '@/hooks/use-token-allowance';
import { useDepositBatch } from '@/integrations/transactions';

import {
  DepositModalDataStep, modalsSliceActions, useAppDispatch, useDepositViewStore, NotificationType, useNotificationStore,
} from '@/store';

import { tokenList, AppLog } from '@/utils';

export interface DepositNotificationContentProps { id: string }

export const DepositNotificationContent: React.FC<DepositNotificationContentProps> = ({ id }) => {
  const dispatch = useAppDispatch();

  const { addNotification, popNotification } = useNotificationStore(), { getBalances } = useBalances();
  const depositViewStore = useDepositViewStore();

  const { value, tokenId } = useMemo(() => {
    const { amount: value, tokenId } = depositViewStore;
    return deserialize(serialize({ value, tokenId }));
  }, []) ?? {};

  const selectedToken = tokenList('obj', tokenId), allowance = useTokenAllowance(selectedToken?.id);

  var batchData = useDepositBatch({ amount: value, token: selectedToken, allowance });

  const batch = batchData?.batch, openBatchModal = batchData?.openBatchModal;
  const batchExecutalbe = batch?.batchExecute;

  const handleStateChange = () => {
    if (!batch?.state) return;

    if (batch?.state && batchExecutalbe?.state == "running") batch.state = batchExecutalbe.activeStep;
    else if (batch?.state == 'error') { handleError() }
    
    if (batch?.state) {
      if (Object.values(DepositModalDataStep).includes(batch?.state as DepositModalDataStep)) {
        dispatch(modalsSliceActions.setDepositModalData({ step: batch?.state as DepositModalDataStep }));
      }
    }
  };

  const handleOpenModal = () => {
    if (!batch?.state) return;
    if (typeof allowance === 'number') {
      dispatch(modalsSliceActions.closeAllowanceVerifyModal());
      handleStateChange(); openBatchModal();
    } else {
      dispatch(modalsSliceActions.setAllowanceVerifyModalData({ tokenSymbol: selectedToken?.symbol }));
      dispatch(modalsSliceActions.openAllowanceVerifyModal());
    }
  };

  const handleError = (err?: any) => {
    if (err) AppLog.error(`Deposit Error`, err);
    dispatch(modalsSliceActions.closeDepositProgressModal());
    dispatch(modalsSliceActions.clearDepositModalData());
    addNotification({ title: `Deposit ${value} ${selectedToken?.symbol} failed`, type: NotificationType.Error, id: Date.now().toString(), });
    popNotification(id)
  }

  useEffect(handleStateChange, [batchExecutalbe?.activeStep, batch.state]);

  useEffect(() => {
    handleOpenModal();
    if (typeof allowance === 'undefined' || !batch?.state) return;
    if (batchExecutalbe?.execute) {

      // console.log(batchExecutalbe);
      
      batchExecutalbe.execute().then((data: any) => {
        if (data) {
          dispatch(modalsSliceActions.closeDepositProgressModal());
          getBalances();
          addNotification({
            title: `Deposited ${value} ${selectedToken?.symbol}`, type: NotificationType.Success, id: Date.now().toString(), transactionLink: '/activity',
          });
          dispatch(modalsSliceActions.clearDepositModalData());
        } else handleError();
      }).catch((err: any) => handleError(err)).finally(() => popNotification(id));
    }
  }, [allowance, batchExecutalbe]);

  return (
    <Link target="_blank" rel="noreferrer" color="dark-blue.500" onClick={handleOpenModal}>
      View progress
    </Link>
  );
};
