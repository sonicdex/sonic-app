import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { appActors, useSwapActor } from '@/integrations/actor';
import {
  FeatureState,
  swapCanisterActions,
  useKeepSync,
  useSwapCanisterStore,
} from '@/store';
import { parseResponseAllPairs } from '@/utils/canister';

export const useAllPairs = () => {
  const dispatch = useDispatch();
  const { allPairsState, allPairs } = useSwapCanisterStore();

  const _swapActor = useSwapActor();

  const getAllPairs = useKeepSync(
    'getAllPairs',
    useCallback(
      async (isRefreshing?: boolean) => {
        try {
          const swapActor =
            _swapActor ??
            (appActors[ENV.canistersPrincipalIDs.swap] as SwapIDL.Factory);

          if (!swapActor) throw new Error('Swap actor not found');

          if (allPairsState !== FeatureState.Loading) {
            dispatch(
              swapCanisterActions.setAllPairsState(
                isRefreshing ? FeatureState.Updating : FeatureState.Loading
              )
            );
            const response = await swapActor.getAllPairs();

            if (response) {
              dispatch(
                swapCanisterActions.setAllPairs(parseResponseAllPairs(response))
              );
            } else {
              throw new Error('No "getAllPairs" response');
            }

            dispatch(swapCanisterActions.setAllPairsState(FeatureState.Idle));
          }
        } catch (error) {
          console.error('getAllPairs: ', error);
          dispatch(swapCanisterActions.setAllPairsState(FeatureState.Error));
        }
      },
      [_swapActor, dispatch, allPairsState]
    )
  );

  return { allPairs, allPairsState, getAllPairs };
};
