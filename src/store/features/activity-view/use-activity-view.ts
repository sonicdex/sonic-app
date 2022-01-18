import { useCallback, useEffect } from 'react';

import { getUserTransactions } from '@/integrations/cap';
import { FeatureState, useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';

import { usePlugStore, useSwapCanisterStore } from '..';
import { activityViewActions, useActivityViewStore } from '.';

export const useActivityView = () => {
  const { principalId } = usePlugStore();
  const { supportedTokenList } = useSwapCanisterStore();
  const { page, activityList } = useActivityViewStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!supportedTokenList) return;
    dispatch(
      activityViewActions.setTokenList(
        parseResponseTokenList(supportedTokenList)
      )
    );
  }, [supportedTokenList, dispatch]);

  console.log(supportedTokenList);

  const getUserTransactionsPage = useCallback(
    (_principalId: string, page: number) => {
      dispatch(activityViewActions.setState(FeatureState.Loading));
      getUserTransactions(_principalId, page)
        .then((res) => {
          dispatch(activityViewActions.pushActivityList(res));
          dispatch(activityViewActions.setState(FeatureState.Idle));
          if (res.length === 0) dispatch(activityViewActions.setEndReached());
        })
        .catch((err) => {
          console.error('getUserTransactions', err);
          dispatch(activityViewActions.setState(FeatureState.Error));
        });
    },
    [dispatch]
  );

  useEffect(() => {
    if (principalId) {
      getUserTransactionsPage(principalId, page);
    } else {
      dispatch(activityViewActions.clearActivityList());
    }
  }, [page, principalId, dispatch, getUserTransactionsPage]);

  useEffect(() => {
    // Updates page 0 activity tab is opened and already has activities
    if (principalId && Object.keys(activityList).length > 0)
      getUserTransactionsPage(principalId, 0);
  }, [principalId, getUserTransactionsPage]);
};
