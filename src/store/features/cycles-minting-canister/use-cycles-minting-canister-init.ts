import { useCallback, useEffect } from 'react';

import { FeatureState, useAppDispatch } from '@/store';
import { AppLog } from '@/utils';
import { fetchICP2XDRConversionRate } from '@/utils/icp';

import { useKeepSync } from '../keep-sync';
import {
  cyclesMintingCanisterSliceActions,
  useCyclesMintingCanisterStore,
} from '.';

export const useCyclesMintingCanisterInit = () => {
  const { ICPXDRconversionRateState } = useCyclesMintingCanisterStore();

  const dispatch = useAppDispatch();

  const getICPXDRConversionRate = useKeepSync(
    'getICPXDRConversionRate',

    useCallback(
      async (isRefreshing?: boolean) => {
        if (ICPXDRconversionRateState !== FeatureState.Loading) {
          try {
            dispatch(
              cyclesMintingCanisterSliceActions.setICPXDRConversionRateState(
                isRefreshing ? FeatureState.Updating : FeatureState.Loading
              )
            );

            const response = await fetchICP2XDRConversionRate();

            const conversionRate =
              response.data.xdr_permyriad_per_icp.toString();

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
            AppLog.error(`ICP XDR conversion rate fetch error`, error);
            dispatch(
              cyclesMintingCanisterSliceActions.setICPXDRConversionRateState(
                FeatureState.Error
              )
            );
          }
        }
      },
      [ICPXDRconversionRateState, dispatch]
    )
  );

  useEffect(() => {
    getICPXDRConversionRate();
    // getICPXDRConversionRate cannot be added to the dependencies array
    // because it is causing an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
