import { modalsSliceActions, useAppDispatch, WrapModalDataStep } from '@/store';
import { useBatchHook } from '..';
import { Batch } from '../..';
import {
  useMintWICPTransactionMemo,
  useLedgerTransferTransactionMemo,
} from '../transactions';

const LEDGER_ACCOUNT_ID =
  'cc659fe529756bae6f72db9937c6c60cf7ad57eb4ac5f930a75748927aab469a';

type Wrap = {
  amount: bigint;
};

export const useWrapBatch = ({ amount }: Wrap) => {
  const dispatch = useAppDispatch();

  const handleOpenBatchModal = () => {
    dispatch(modalsSliceActions.openWithdrawProgressModal());
  };

  return [
    useBatchHook({
      transactions: {
        ledgerTransfer: useLedgerTransferTransactionMemo({
          toAccountId: LEDGER_ACCOUNT_ID,
          amount,
        }),
        // TODO: Once Plug will have ability to pass onSuccess to next transaction,
        // add blockHeight from ledgerTransfer
        wrap: useMintWICPTransactionMemo({ blockHeight: BigInt(0) }),
      },
      handleRetry: () => {
        dispatch(modalsSliceActions.closeWithdrawProgressModal());
        return Promise.resolve(false);
      },
    }),
    handleOpenBatchModal,
  ] as [Batch.Hook<WrapModalDataStep>, () => void];
};
