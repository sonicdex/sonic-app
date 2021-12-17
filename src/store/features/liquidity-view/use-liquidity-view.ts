import { useAppDispatch } from '@/store';
import { getEqualLPTokenAmount } from '@/utils/format';
import { useEffect } from 'react';
import { liquidityViewActions, useLiquidityViewStore } from '.';
import { useSwapCanisterStore } from '..';

export const useLiquidityView = () => {
  const dispatch = useAppDispatch();
  const { token0, token1 } = useLiquidityViewStore();
  const { allPairs } = useSwapCanisterStore();

  console.log(allPairs);

  useEffect(() => {
    if (!token0.token || !token1.token || !allPairs) {
      return;
    }

    if (
      allPairs[token0.token.id] &&
      !allPairs[token0.token.id][token1.token.id]
    ) {
      dispatch(
        liquidityViewActions.setToken({ data: 'token0', tokenId: undefined })
      );
    } else {
      dispatch(
        liquidityViewActions.setValue({
          data: 'token0',
          value: getEqualLPTokenAmount({
            token0: token0.value,
            reserve0: String(
              allPairs[token0.token.id][token0.token.id].reserve0
            ),
            reserve1: String(
              allPairs[token0.token.id][token0.token.id].reserve1
            ),
          }),
        })
      );
    }
  }, [token0.value]);

  useEffect(() => {
    if (!token0.token || !token1.token || !allPairs) {
      return;
    }

    if (
      allPairs[token0.token.id] &&
      !allPairs[token0.token.id][token1.token.id]
    ) {
      dispatch(
        liquidityViewActions.setToken({ data: 'token1', tokenId: undefined })
      );
    } else {
      dispatch(
        liquidityViewActions.setValue({
          data: 'token1',
          value: getEqualLPTokenAmount({
            token0: token1.value,
            reserve0: String(
              allPairs[token1.token.id][token1.token.id].reserve0
            ),
            reserve1: String(
              allPairs[token1.token.id][token1.token.id].reserve1
            ),
          }),
        })
      );
    }
  }, [token1.value]);
};
