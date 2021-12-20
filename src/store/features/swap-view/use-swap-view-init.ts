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
    if (!from.metadata) return;
    if (!to.metadata) return;
    if (!allPairs) return;

    if (
      allPairs[from.metadata.id] &&
      !allPairs[from.metadata.id][to.metadata.id]
    ) {
      dispatch(swapViewActions.setToken({ data: 'to', tokenId: undefined }));
    } else {
      dispatch(
        swapViewActions.setValue({
          data: 'to',
          value: getAmountOut(
            from.value,
            from.metadata.decimals,
            to.metadata.decimals,
            String(allPairs[from.metadata.id][to.metadata.id].reserve0),
            String(allPairs[from.metadata.id][to.metadata.id].reserve1)
          ),
        })
      );
    }
  }, [from.value, from.metadata, to.metadata]);
};
