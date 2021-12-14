import { useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';
import { getAmountOut } from '@/utils/format';
import { useEffect } from 'react';
import { swapViewActions, useSwapViewStore } from '.';
import { useSwapStore } from '..';

export const useSwapView = () => {
  const dispatch = useAppDispatch();
  const { allPairs, supportedTokenList } = useSwapStore();
  const { from, to, pairList } = useSwapViewStore();

  useEffect(() => {
    if (!allPairs) return;
    dispatch(swapViewActions.setPairList(allPairs));
  }, [allPairs]);

  useEffect(() => {
    if (!supportedTokenList) return;
    dispatch(
      swapViewActions.setTokenList(parseResponseTokenList(supportedTokenList))
    );
  }, [supportedTokenList]);

  useEffect(() => {
    if (!from.token) return;
    if (!to.token) return;
    if (!pairList) return;

    if (pairList[from.token.id] && !pairList[from.token.id][to.token.id]) {
      dispatch(swapViewActions.setToken({ data: 'to', tokenId: undefined }));
    } else {
      dispatch(
        swapViewActions.setValue({
          data: 'to',
          value: getAmountOut(
            from.value,
            from.token.decimals,
            to.token.decimals,
            String(pairList[from.token.id][to.token.id].reserve0),
            String(pairList[from.token.id][to.token.id].reserve1)
          ),
        })
      );
    }
  }, [from.value, from.token, to.token]);
};
