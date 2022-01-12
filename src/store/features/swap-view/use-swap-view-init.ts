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
  }, [dispatch, icpPrice, supportedTokenList]);

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
          value: getAmountOut({
            amountIn: from.value,
            decimalsIn: from.metadata.decimals,
            decimalsOut: to.metadata.decimals,
            reserveIn: String(
              allPairs[from.metadata.id][to.metadata.id].reserve0
            ),
            reserveOut: String(
              allPairs[from.metadata.id][to.metadata.id].reserve1
            ),
          }),
        })
      );
    }
    // FIXME: With all of the deps in this effect, it is causing
    //        review step update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from.value, from.metadata, to.metadata]);
};
