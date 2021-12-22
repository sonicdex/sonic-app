import { getUserTransactions } from '@/integrations/cap';
import { useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';
import { useEffect } from 'react';
import { activityViewActions } from '.';
import { usePlugStore, useSwapCanisterStore } from '..';

export const useActivityView = () => {
  const { principalId } = usePlugStore();
  const { supportedTokenList } = useSwapCanisterStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!supportedTokenList) return;
    dispatch(
      activityViewActions.setTokenList(
        parseResponseTokenList(supportedTokenList)
      )
    );
  }, [supportedTokenList]);

  useEffect(() => {
    if (principalId) {
      getUserTransactions(principalId)
        .then((res) => dispatch(activityViewActions.pushActivityList(res)))
        .catch((err) => console.error('getUserTransactions', err));
    }
  }, [principalId]);
};
