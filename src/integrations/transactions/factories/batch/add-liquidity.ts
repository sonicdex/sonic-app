import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AddLiquidityModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useSwapCanisterStore,
} from '@/store';

import {
  useMemorizedDepositTransaction,
  useMemorizedAddLiquidityTransaction,
  useBatchHook,
  useMemorizedApproveTransaction,
} from '..';
import { AddLiquidity, Batch, Deposit } from '../..';
import { getDepositTransactions, getToDepositAmount } from './utils';

export const useAddLiquidityBatch = (addLiquidityParams: AddLiquidity) => {
  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapCanisterStore();

  if (!sonicBalances) {
    throw new Error('Sonic balance are required');
  }

  if (
    !addLiquidityParams.token0.metadata ||
    !addLiquidityParams.token1.metadata
  ) {
    throw new Error('Tokens are required');
  }

  const navigate = useNavigate();

  const deposit0Params = useMemo(() => {
    if (addLiquidityParams.token0.metadata) {
      return {
        token: addLiquidityParams.token0.metadata,
        amount: getToDepositAmount(
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
        amount: getToDepositAmount(
          sonicBalances[addLiquidityParams.token1.metadata?.id],
          addLiquidityParams.token1.metadata.decimals,
          addLiquidityParams.token1.value
        ),
      };
    }
  }, [sonicBalances, addLiquidityParams.token1]) as Deposit;

  const approve0 = useMemorizedApproveTransaction(deposit0Params);
  const deposit0 = useMemorizedDepositTransaction(deposit0Params);

  const approve1 = useMemorizedApproveTransaction(deposit1Params);
  const deposit1 = useMemorizedDepositTransaction(deposit1Params);

  const addLiquidity = useMemorizedAddLiquidityTransaction(addLiquidityParams);

  const transactions = useMemo(() => {
    let _transactions = {};

    if (addLiquidityParams.token0.metadata) {
      _transactions = {
        ...getDepositTransactions({
          txNames: ['approve0', 'deposit0'],
          approveTx: approve0,
          depositTx: deposit0,
          token: addLiquidityParams.token0,
          balance: sonicBalances[addLiquidityParams.token0.metadata.id],
        }),
      };
    }

    if (addLiquidityParams.token1.metadata) {
      _transactions = {
        ...getDepositTransactions({
          txNames: ['approve1', 'deposit1'],
          approveTx: approve1,
          depositTx: deposit1,
          token: addLiquidityParams.token1,
          balance: sonicBalances[addLiquidityParams.token1.metadata.id],
        }),
      };
    }

    _transactions = {
      ..._transactions,
      addLiquidity,
    };

    return _transactions;
  }, [...Object.values(addLiquidityParams)]);

  const handleRetry = async () => {
    return new Promise<boolean>((resolve) => {
      dispatch(
        modalsSliceActions.setAddLiquidityData({
          callbacks: [
            // Retry callback
            () => {
              openAddLiquidityModal();
              resolve(true);
            },
            // Not retry callback
            () => {
              navigate(
                `/assets/withdraw?tokenId=${addLiquidityParams.token0.metadata?.id}&amount=${addLiquidityParams.token0.value}`
              );
              resolve(false);
            },
          ],
        })
      );

      dispatch(modalsSliceActions.openAddLiquidityFailModal());
    });
  };

  const openAddLiquidityModal = () => {
    dispatch(
      modalsSliceActions.setAddLiquidityData({
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
