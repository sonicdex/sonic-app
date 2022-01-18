import BigNumber from 'bignumber.js';
import { useEffect } from 'react';

import { ENV } from '@/config';
import { getICPTokenMetadata, ICP_METADATA } from '@/constants';
import { useTokenSelectionChecker } from '@/hooks';
import { PairList } from '@/models';
import { useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';
import {
  formatAmount,
  getSwapAmountOut,
  getXTCValueFromICP,
} from '@/utils/format';
import { getTokenPaths } from '@/utils/maximal-paths';

import {
  useCyclesMintingCanisterStore,
  usePriceStore,
  useSwapCanisterStore,
} from '..';
import { swapViewActions, useSwapViewStore } from '.';

export const useSwapView = () => {
  const dispatch = useAppDispatch();
  const { icpPrice } = usePriceStore();
  const { allPairs, supportedTokenList } = useSwapCanisterStore();
  const { from, to, tokenList, keepInSonic } = useSwapViewStore();
  const { ICPXDRconversionRate } = useCyclesMintingCanisterStore();

  const { isTokenSelected: isICPSelected } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
  });

  const { isTokenSelected: isWICPSelected } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
    targetId: ENV.canistersPrincipalIDs.WICP,
  });

  const { isTokenSelected: isXTCSelected } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
    targetId: ENV.canistersPrincipalIDs.XTC,
  });

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

  function handleICPToXTCChange() {
    const xtcMetadata = tokenList?.[ENV.canistersPrincipalIDs.XTC];

    if (ICPXDRconversionRate && xtcMetadata) {
      const cyclesWithFees = getXTCValueFromICP({
        amount: from.value,
        conversionRate: ICPXDRconversionRate,
        fee: xtcMetadata.fee,
        decimals: xtcMetadata.decimals,
      });

      const icpFeeInXTC = getXTCValueFromICP({
        amount: formatAmount(ICP_METADATA.fee, ICP_METADATA.decimals),
        conversionRate: ICPXDRconversionRate,
        fee: xtcMetadata.fee,
        decimals: xtcMetadata.decimals,
      });

      const xtcFee = new BigNumber(
        formatAmount(xtcMetadata.fee, xtcMetadata.decimals)
      );

      const cycles = cyclesWithFees
        .minus(icpFeeInXTC.multipliedBy(2))
        .minus(xtcFee.multipliedBy(keepInSonic ? 3 : 1));

      dispatch(
        swapViewActions.setValue({
          data: 'to',
          value: cycles.toNumber() > 0 ? cycles.toString() : '',
        })
      );
    }
  }

  function handleICPToTokenChange() {
    const wrappedICPMetadata = supportedTokenList?.find(
      (token) => token.id === ENV.canistersPrincipalIDs.WICP
    );

    if (wrappedICPMetadata && tokenList) {
      const paths = getTokenPaths(
        allPairs as PairList,
        tokenList,
        wrappedICPMetadata.id,
        from.value
      );

      const fromWICP = {
        ...from,
        metadata: wrappedICPMetadata,
        paths,
      };

      dispatch(
        swapViewActions.setValue({
          data: 'to',
          value: getSwapAmountOut(fromWICP, to),
        })
      );
    }
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
  }, [allPairs, dispatch]);

  useEffect(() => {
    if (!from.metadata || !to.metadata || !allPairs) return;

    if (isICPSelected && isWICPSelected) {
      handleICPToWICPChange();
      return;
    }

    if (isICPSelected && isXTCSelected) {
      handleICPToXTCChange();
      return;
    }

    if (isICPSelected) {
      handleICPToTokenChange();
      return;
    }

    dispatch(
      swapViewActions.setValue({
        data: 'to',
        value: getSwapAmountOut(from, to),
      })
    );
  }, [from, to.metadata, dispatch, keepInSonic]);
};
