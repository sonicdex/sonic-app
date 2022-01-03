import { useMemo } from 'react';

import {
  AddLiquidityModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useLiquidityViewStore,
  useSwapCanisterStore,
} from '@/store';

import { AddLiquidity, Batch, Deposit } from '../..';
import {
  useAddLiquidityTransactionMemo,
  useApproveTransactionMemo,
  useBatchHook,
  useDepositTransactionMemo,
} from '..';
import { useCreatePairTransactionMemo } from '../transactions/create-pair';
import { getAmountDependsOnBalance,getDepositTransactions } from './utils';

interface Transactions {
  [transactionName: string]: any;
}

export const useAddLiquidityBatch = (addLiquidityParams: AddLiquidity) => {
  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapCanisterStore();
  const { pair } = useLiquidityViewStore();

  if (!sonicBalances) {
    throw new Error('Sonic balance are required');
  }

  if (
    !addLiquidityParams.token0.metadata ||
    !addLiquidityParams.token1.metadata
  ) {
    throw new Error('Tokens are required');
  }

  const deposit0Params = useMemo(() => {
    if (addLiquidityParams.token0.metadata) {
      return {
        token: addLiquidityParams.token0.metadata,
        amount: getAmountDependsOnBalance(
          sonicBalances[addLiquidityParams.token0.metadata?.id],
          addLiquidityParams.token0.metadata.decimals,
          addLiquidityParams.token0.value
        ),
      };
    }
  }, [sonicBalances, addLiquidityParams.token0]) as Deposit;

  const deposit1Params = useMemo(() => {
    if (addLiquidityParams.token1.metadata) {
      return {
        token: addLiquidityParams.token1.metadata,
        amount: getAmountDependsOnBalance(
          sonicBalances[addLiquidityParams.token1.metadata?.id],
          addLiquidityParams.token1.metadata.decimals,
          addLiquidityParams.token1.value
        ),
      };
    }
  }, [sonicBalances, addLiquidityParams.token1]) as Deposit;

  const createPairParams = useMemo(() => {
    return {
      token0: addLiquidityParams.token0,
      token1: addLiquidityParams.token1,
    };
  }, [addLiquidityParams.token0, addLiquidityParams.token1]);

  const approve0 = useApproveTransactionMemo(deposit0Params);
  const deposit0 = useDepositTransactionMemo(deposit0Params);

  const approve1 = useApproveTransactionMemo(deposit1Params);
  const deposit1 = useDepositTransactionMemo(deposit1Params);

  const createPair = useCreatePairTransactionMemo(createPairParams);
  const addLiquidity = useAddLiquidityTransactionMemo(addLiquidityParams);

  const transactions = useMemo(() => {
    let _transactions: Transactions = {};
    if (!pair) {
      _transactions = {
        ..._transactions,
        createPair,
      };
    }

    if (addLiquidityParams.token0.metadata) {
      _transactions = {
        ..._transactions,
        ...getDepositTransactions({
          txNames: ['approve0', 'deposit0'],
          approveTx: approve0,
          depositTx: deposit0,
        }),
      };
    }

    if (addLiquidityParams.token1.metadata) {
      _transactions = {
        ..._transactions,
        ...getDepositTransactions({
          txNames: ['approve1', 'deposit1'],
          approveTx: approve1,
          depositTx: deposit1,
        }),
      };
    }

    _transactions = {
      ..._transactions,
      addLiquidity,
    };

    return _transactions;
  }, [...Object.values(addLiquidityParams), pair]);

  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      dispatch(
        modalsSliceActions.setAddLiquidityModalData({
          callbacks: [
            // Retry callback
            () => {
              openAddLiquidityModal();
              resolve(true);
            },
            // Cancel callback
            () => {
              resolve(false);
            },
          ],
        })
      );

      dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
      dispatch(modalsSliceActions.openAddLiquidityFailModal());
    });
  };

  const openAddLiquidityModal = () => {
    dispatch(
      modalsSliceActions.setAddLiquidityModalData({
        steps: Object.keys(transactions) as AddLiquidityModalDataStep[],
        token0Symbol: addLiquidityParams.token0.metadata?.symbol,
        token1Symbol: addLiquidityParams.token1.metadata?.symbol,
      })
    );

    dispatch(modalsSliceActions.openAddLiquidityProgressModal());
  };

  return [
    useBatchHook<AddLiquidityModalDataStep>({ transactions, handleRetry }),
    openAddLiquidityModal,
  ] as [Batch.Hook<AddLiquidityModalDataStep>, () => void];
};
