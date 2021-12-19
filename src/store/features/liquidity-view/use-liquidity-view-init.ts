import { FeatureState, useAppDispatch } from '@/store';
import { useSwapActor } from '@/integrations/actor';
import { liquidityViewActions, useLiquidityViewStore } from '.';
import { Principal } from '@dfinity/principal';
import { useEffect } from 'react';
import { parseResponsePair } from '@/utils/canister';

export const useLiquidityViewInit = () => {
  const dispatch = useAppDispatch();
  const { token0, token1 } = useLiquidityViewStore();
  const swapActor = useSwapActor();

  useEffect(() => {
    if (token0.token?.id && token1.token?.id) {
      getPair();
    }
  }, [token0.token?.id, token1.token?.id]);

  async function getPair() {
    if (swapActor && token0.token?.id && token1.token?.id) {
      try {
        dispatch(liquidityViewActions.setPairState(FeatureState.Loading));

        const response = await swapActor.getPair(
          Principal.fromText(token0.token.id),
          Principal.fromText(token1.token.id)
        );

        dispatch(liquidityViewActions.setPair(parseResponsePair(response)));
        dispatch(liquidityViewActions.setPairState(FeatureState.Idle));

        return response;
      } catch (error) {
        console.error('getPair: ', error);
        dispatch(liquidityViewActions.setPairState(FeatureState.Error));
      }
    }
  }
};
