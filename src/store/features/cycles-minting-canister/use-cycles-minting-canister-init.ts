import { useCallback, useEffect } from 'react';

import { useCyclesMintingActor } from '@/integrations/actor';
import { FeatureState, useAppDispatch } from '@/store';

import { useKeepSync } from '../keep-sync';
import {
  cyclesMintingCanisterSliceActions,
  useCyclesMintingCanisterStore,
} from '.';

export const useCyclesMintingCanisterInit = () => {
  const { ICPXDRconversionRateState } = useCyclesMintingCanisterStore();

  const cyclesMintingActor = useCyclesMintingActor();

  const dispatch = useAppDispatch();

  const getICPXDRConversionRate = useKeepSync(
    'getICPXDRConversionRate',

    useCallback(
      async (isRefreshing?: boolean) => {
        if (
          cyclesMintingActor &&
          ICPXDRconversionRateState !== FeatureState.Loading
        ) {
          try {
            dispatch(
              cyclesMintingCanisterSliceActions.setICPXDRConversionRateState(
                isRefreshing ? FeatureState.Updating : FeatureState.Loading
              )
            );

            const response =
              await cyclesMintingActor.get_icp_xdr_conversion_rate();

            const conversionRate =
              response?.data?.xdr_permyriad_per_icp?.toString();

            if (response) {
              dispatch(
                cyclesMintingCanisterSliceActions.setICPXDRConversionRate(
                  conversionRate
                )
              );
            } else {
              throw new Error('No "getICPXDRConversionRate" response');
            }

            dispatch(
              cyclesMintingCanisterSliceActions.setICPXDRConversionRateState(
                FeatureState.Idle
              )
            );

            return response;
          } catch (error) {
            console.error('getICPXDRConversionRate: ', error);
            dispatch(
              cyclesMintingCanisterSliceActions.setICPXDRConversionRateState(
                FeatureState.Error
              )
            );
          }
        }
      },
      [ICPXDRconversionRateState, cyclesMintingActor, dispatch]
    )
  );

  useEffect(() => {
    if (cyclesMintingActor) {
      getICPXDRConversionRate();
    }
    // getICPXDRConversionRate cannot be added to the dependencies array
    // because it is causing an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cyclesMintingActor]);
};
