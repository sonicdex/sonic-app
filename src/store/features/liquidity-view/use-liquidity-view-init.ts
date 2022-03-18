import { useCallback, useEffect } from 'react';

import { ENV } from '@/config';
import { useSwapActor } from '@/integrations/actor';
import { Pair } from '@/models';
import { useAppDispatch } from '@/store';

import { useSwapCanisterStore } from '..';
import { liquidityViewActions, useLiquidityViewStore } from '.';

export const useLiquidityViewInit = () => {
  const dispatch = useAppDispatch();
  const { token0, token1 } = useLiquidityViewStore();
  const { supportedTokenList, allPairs } = useSwapCanisterStore();
  const swapActor = useSwapActor();

  const getPair = useCallback(async () => {
    if (swapActor && token0.metadata?.id && token1.metadata?.id) {
      if (allPairs) {
        const localPair = allPairs[token0.metadata.id]?.[
          token1.metadata.id
        ] as unknown as Pair;
        if (localPair) return dispatch(liquidityViewActions.setPair(localPair));
      }
    }
    return dispatch(liquidityViewActions.setPair(undefined));
  }, [dispatch, swapActor, token0.metadata?.id, token1.metadata?.id, allPairs]);

  useEffect(() => {
    if (supportedTokenList && !token0.metadata?.id) {
      const token =
        supportedTokenList.find(
          (token) => token.id === ENV.canistersPrincipalIDs.WICP
        ) ?? supportedTokenList[0];

      dispatch(liquidityViewActions.setToken({ data: 'token0', token }));
    }
  }, [supportedTokenList, dispatch]);

  useEffect(() => {
    if (token0.metadata?.id && token1.metadata?.id) {
      getPair();
    }
  }, [token0.metadata?.id, token1.metadata?.id, getPair]);
};
