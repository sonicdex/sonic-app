import { Principal } from '@dfinity/principal';
import { useCallback, useEffect } from 'react';

import { getUserTransactions } from '@/integrations/cap';
import { getUserLedgerTransactions } from '@/integrations/ledger';
import { FeatureState, useAppDispatch } from '@/store';
import { AppLog } from '@/utils';
import { parseResponseTokenList } from '@/utils/canister';
import { getAccountId } from '@/utils/icp';

import { useWalletStore, useSwapCanisterStore } from '..';
import { activityViewActions, useActivityViewStore } from '.';

export const useActivityView = () => {
  const { principalId } = useWalletStore();
  const { supportedTokenList } = useSwapCanisterStore();
  const { page, lastPage, fetchedPages } = useActivityViewStore();
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
    (_principalId: string, _page?: number) => {
      dispatch(activityViewActions.setCAPState(FeatureState.Loading));
      getUserTransactions(_principalId, _page)
        .then((res) => {
          dispatch(activityViewActions.pushActivityList(res.data));
          dispatch(activityViewActions.setCAPState(FeatureState.Idle));
          dispatch(activityViewActions.pushFetchedPages(res.page));

          if (typeof lastPage === 'undefined' || res.page > lastPage) {
            dispatch(activityViewActions.setLastPage(res.page));
          }
        })
        .catch((err) => {
          AppLog.error(`Failed to get user transactions: page=${_page}`, err);
          dispatch(activityViewActions.setCAPState(FeatureState.Error));
        });
    },
    [dispatch, lastPage]
  );

  useEffect(() => {
    if (principalId) {
      if (typeof page !== 'undefined' && !fetchedPages.includes(page)) {
        getUserTransactionsPage(principalId, page);
      }
    }
  }, [page, principalId, dispatch, getUserTransactionsPage, fetchedPages]);

  useEffect(() => {
    if (principalId) {
      getUserTransactionsPage(principalId);
    } else {
      dispatch(activityViewActions.clearActivityList());
    }
  }, [principalId]);

  useEffect(() => {
    if (principalId) {
      dispatch(activityViewActions.setLedgerState(FeatureState.Loading));
      getUserLedgerTransactions(
        getAccountId(Principal.fromText(principalId), 0)
      )
        .then((transactions) => {
          dispatch(activityViewActions.setLedgerState(FeatureState.Idle));
          dispatch(activityViewActions.setLedgerTransactions(transactions));
          dispatch(activityViewActions.pushActivityList([]));
        })
        .catch((err) => {
          AppLog.error(
            `Failed to get user ledger transactions: principal=${principalId}`,
            err
          );
          dispatch(activityViewActions.setLedgerState(FeatureState.Error));
        });
    }
  }, [principalId, dispatch]);
};
