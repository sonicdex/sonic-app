import { useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';
import { getAmountOut } from '@/utils/format';
import { useEffect } from 'react';
import { swapViewActions, useSwapViewStore } from '.';
import { useSwapCanisterStore } from '..';

export const useSwapView = () => {
  const dispatch = useAppDispatch();
  const { allPairs, supportedTokenList } = useSwapCanisterStore();
  const { from, to } = useSwapViewStore();

  useEffect(() => {
    if (!supportedTokenList) return;
    dispatch(
      swapViewActions.setTokenList(parseResponseTokenList(supportedTokenList))
    );
  }, [supportedTokenList]);

  useEffect(() => {
    if (!from.token) return;
    if (!to.token) return;
    if (!allPairs) return;

    if (allPairs[from.token.id] && !allPairs[from.token.id][to.token.id]) {
      dispatch(swapViewActions.setToken({ data: 'to', tokenId: undefined }));
    } else {
      dispatch(
        swapViewActions.setValue({
          data: 'to',
          value: getAmountOut(
            from.value,
            from.token.decimals,
            to.token.decimals,
            String(allPairs[from.token.id][to.token.id].reserve0),
            String(allPairs[from.token.id][to.token.id].reserve1)
          ),
        })
      );
    }
  }, [from.value, from.token, to.token]);
};
