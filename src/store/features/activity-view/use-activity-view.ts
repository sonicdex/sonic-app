import { Principal } from '@dfinity/principal';
import { useCallback, useEffect } from 'react';

import { getUserTransactions } from '@/integrations/cap';
import { getUserLedgerTransactions } from '@/integrations/ledger';
import { FeatureState, useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';
import { getAccountId } from '@/utils/icp';

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

  const getUserTransactionsPage = useCallback(
    (_principalId: string, page: number) => {
      dispatch(activityViewActions.setCAPState(FeatureState.Loading));
      getUserTransactions(_principalId, page)
        .then((res) => {
          console.log(res);
          dispatch(activityViewActions.pushActivityList(res));
          dispatch(activityViewActions.setCAPState(FeatureState.Idle));
          if (res.length === 0) dispatch(activityViewActions.setEndReached());
        })
        .catch((err) => {
          console.error('getUserTransactions', err);
          dispatch(activityViewActions.setCAPState(FeatureState.Error));
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

  useEffect(() => {
    if (principalId) {
      dispatch(activityViewActions.setLedgerState(FeatureState.Loading));
      getUserLedgerTransactions(
        getAccountId(Principal.fromText(principalId), 0)
      )
        .then((transactions) => {
          dispatch(activityViewActions.setLedgerState(FeatureState.Idle));
          dispatch(activityViewActions.pushActivityList(transactions));
        })
        .catch((err) => {
          console.error('getUserLedgerTransactions', err);
          dispatch(activityViewActions.setLedgerState(FeatureState.Error));
        });
    }
  }, [principalId, dispatch]);
};
