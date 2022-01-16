import BigNumber from 'bignumber.js';
import { useEffect } from 'react';

import { ENV } from '@/config';
import { getICPTokenMetadata, ICP_METADATA } from '@/constants';
import { useICPSelectionDetectorMemo } from '@/hooks';
import { useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';
import { formatAmount, getSwapAmountOut } from '@/utils/format';

import { usePriceStore, useSwapCanisterStore } from '..';
import { swapViewActions, useSwapViewStore } from '.';

export const useSwapView = () => {
  const dispatch = useAppDispatch();
  const { icpPrice } = usePriceStore();
  const { allPairs, supportedTokenList } = useSwapCanisterStore();
  const { from, to } = useSwapViewStore();

  const { isFirstTokenIsICP, isSecondTokenIsICP } = useICPSelectionDetectorMemo(
    from.metadata?.id,
    to.metadata?.id
  );

  function handleICPToWICPChange() {
    const value = new BigNumber(from.value).minus(
      formatAmount(ICP_METADATA.fee, ICP_METADATA.decimals)
    );
    dispatch(
      swapViewActions.setValue({
        data: 'to',
        value: value.toNumber() > 0 ? value.toString() : '',
      })
    );
  }

  useEffect(() => {
    if (!supportedTokenList) return;

    const tokenList = parseResponseTokenList([
      getICPTokenMetadata(icpPrice),
      ...supportedTokenList,
    ]);
    dispatch(swapViewActions.setTokenList(tokenList));
  }, [dispatch, icpPrice, supportedTokenList]);

  useEffect(() => {
    dispatch(swapViewActions.setAllPairs(allPairs));
  }, [allPairs]);

  useEffect(() => {
    if (!from.metadata) return;
    if (!to.metadata) return;
    if (!allPairs) return;

    if (
      (isFirstTokenIsICP &&
        to.metadata.id === ENV.canistersPrincipalIDs.WICP) ||
      (isSecondTokenIsICP &&
        from.metadata.id === ENV.canistersPrincipalIDs.WICP)
    ) {
      handleICPToWICPChange();
      return;
    }

    dispatch(
      swapViewActions.setValue({
        data: 'to',
        value: getSwapAmountOut(from, to),
      })
    );
  }, [from.value, from.metadata, to.metadata]);
};
