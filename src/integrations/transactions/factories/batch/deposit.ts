import {
  DepositModalDataStep,
  modalsSliceActions,
  useAppDispatch,
} from '@/store';
import { useMemo } from 'react';
import {
  useMemorizedApproveTransaction,
  useMemorizedDepositTransaction,
  useBatchHook,
} from '..';
import { Batch, Deposit } from '../..';

export const useDepositBatch = (deposit: Deposit) => {
  const dispatch = useAppDispatch();

  const approveTx = useMemorizedApproveTransaction(deposit);
  const depositTx = useMemorizedDepositTransaction(deposit);

  const transactions = useMemo(() => {
    return {
      approve: approveTx,
      deposit: depositTx,
    };
  }, [approveTx, depositTx]);

  const handleOpenDepositModal = () => {
    dispatch(
      modalsSliceActions.setDepositData({
        steps: Object.keys(transactions) as DepositModalDataStep[],
        tokenSymbol: deposit.token?.symbol,
      })
    );
    dispatch(modalsSliceActions.openDepositProgressModal());
  };
  return [useBatchHook({ transactions }), handleOpenDepositModal] as [
    Batch.Hook<DepositModalDataStep>,
    () => void
  ];
};
