import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AddLiquidityModalDataStep,
  modalsSliceActions,
  useAppDispatch,
  useSwapCanisterStore,
} from '@/store';
import { parseAmount } from '@/utils/format';

import {
  useMemorizedDepositTransaction,
  useMemorizedAddLiquidityTransaction,
  useBatchHook,
  useMemorizedApproveTransaction,
} from '..';
import { AddLiquidity, Batch } from '../..';
import { getToDepositAmount } from './utils';

export const useAddLiquidityBatch = (addLiquidityParams: AddLiquidity) => {
  const dispatch = useAppDispatch();
  const { sonicBalances } = useSwapCanisterStore();

  if (!sonicBalances) {
    throw new Error('Sonic balance are required');
  }

  if (!addLiquidityParams.token0.token || !addLiquidityParams.token1.token) {
    throw new Error('Tokens are required');
  }

  const navigate = useNavigate();

  const depositParams = {
    token: addLiquidityParams.token0.token,
    amount: getToDepositAmount(
      sonicBalances[addLiquidityParams.token0.token.id],
      addLiquidityParams.token0.token.decimals,
      addLiquidityParams.token0.value
    ),
  };

  const approve = useMemorizedApproveTransaction(depositParams);
  const deposit = useMemorizedDepositTransaction(depositParams);
  const addLiquidity = useMemorizedAddLiquidityTransaction(addLiquidityParams);

  const transactions = useMemo(() => {
    let _transactions = {};

    if (addLiquidityParams.token0.token) {
      const sonicTokenBalance = addLiquidityParams.token0.token
        ? sonicBalances[addLiquidityParams.token0.token.id]
        : 0;
      const neededBalance = Number(
        parseAmount(
          addLiquidityParams.token0.value,
          addLiquidityParams.token0.token.decimals
        )
      );
      if (sonicTokenBalance < neededBalance) {
        _transactions = {
          approve,
          deposit,
        };
      }
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
                `/assets/withdraw?tokenId=${addLiquidityParams.token0.token?.id}&amount=${addLiquidityParams.token0.value}`
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
        token0Symbol: addLiquidityParams.token0.token?.symbol,
        token1Symbol: addLiquidityParams.token1.token?.symbol,
      })
    );

    dispatch(modalsSliceActions.openAddLiquidityProgressModal());
  };

  return [
    useBatchHook<AddLiquidityModalDataStep>({ transactions, handleRetry }),
    openAddLiquidityModal,
  ] as [Batch.Hook<AddLiquidityModalDataStep>, () => void];
};
