import BigNumber from 'bignumber.js';
import { useEffect } from 'react';

import { ENV } from '@/config';
import { getICPTokenMetadata, ICP_METADATA } from '@/constants';
import { useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';
import { formatAmount, getAmountOut } from '@/utils/format';

import { usePriceStore, useSwapCanisterStore } from '..';
import { swapViewActions, useSwapViewStore } from '.';

export const useSwapView = () => {
  const dispatch = useAppDispatch();
  const { icpPrice } = usePriceStore();
  const { allPairs, supportedTokenList } = useSwapCanisterStore();
  const { from, to } = useSwapViewStore();

  useEffect(() => {
    if (!supportedTokenList) return;

    const tokenList = parseResponseTokenList([
      getICPTokenMetadata(icpPrice),
      ...supportedTokenList,
    ]);
    dispatch(swapViewActions.setTokenList(tokenList));
  }, [supportedTokenList]);

  useEffect(() => {
    if (!from.metadata) return;
    if (!to.metadata) return;
    if (!allPairs) return;

    if (
      (from.metadata.id === ICP_METADATA.id &&
        to.metadata.id === ENV.canisterIds.WICP) ||
      (to.metadata.id === ICP_METADATA.id &&
        from.metadata.id === ENV.canisterIds.WICP)
    ) {
      const value = new BigNumber(from.value).minus(
        formatAmount(ICP_METADATA.fee, ICP_METADATA.decimals)
      );
      dispatch(
        swapViewActions.setValue({
          data: 'to',
          value: value.toNumber() > 0 ? value.toString() : '',
        })
      );
      return;
    }

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
