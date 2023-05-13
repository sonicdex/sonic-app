import { useEffect } from 'react';

import { allowanceActions, useAllowanceStore, useAppDispatch, useWalletStore } from '@/store';

import { validPrincipalId } from '@/utils';

export const useTokenAllowance = (tokenId = ''): number | undefined => {
  const dispatch = useAppDispatch();
  const { principalId } = useWalletStore();
  const { tokensAllowance } = useAllowanceStore();

  useEffect(() => {
    if (validPrincipalId(tokenId) && principalId) {
      if (tokensAllowance[tokenId]) {
        if (Date.now() > tokensAllowance[tokenId].expiration) {
          dispatch(allowanceActions.fetchAllowance({ tokenId }));
        }
      } else {
        dispatch(allowanceActions.fetchAllowance({ tokenId }));
      }
    }
  }, [tokenId, principalId, dispatch, tokensAllowance]);

  return tokensAllowance[tokenId]?.allowance;
};
