import { Principal } from '@dfinity/principal';
import { useEffect } from 'react';

import { ENV } from '@/config';
import { useSwapActor } from '@/integrations/actor';
import { FeatureState, useAppDispatch } from '@/store';
import { parseResponsePair } from '@/utils/canister';

import { useSwapCanisterStore } from '..';
import { liquidityViewActions, useLiquidityViewStore } from '.';

export const useLiquidityViewInit = () => {
  const dispatch = useAppDispatch();
  const { token0, token1 } = useLiquidityViewStore();
  const { supportedTokenList } = useSwapCanisterStore();
  const swapActor = useSwapActor();

  useEffect(() => {
    if (supportedTokenList && !token0.metadata) {
      const token =
        supportedTokenList.find((token) => token.id === ENV.canisterIds.WICP) ??
        supportedTokenList[0];

      dispatch(liquidityViewActions.setToken({ data: 'token0', token }));
    }
  }, [supportedTokenList]);

  useEffect(() => {
    if (token0.metadata?.id && token1.metadata?.id) {
      getPair();
    }
  }, [token0.metadata?.id, token1.metadata?.id]);

  async function getPair() {
    if (swapActor && token0.metadata?.id && token1.metadata?.id) {
      try {
        dispatch(liquidityViewActions.setPairState(FeatureState.Loading));

        const response = await swapActor.getPair(
          Principal.fromText(token0.metadata.id),
          Principal.fromText(token1.metadata.id)
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
