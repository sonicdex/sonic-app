import { useEffect, useState } from 'react';
import { getICPTokenMetadata } from '@/constants';
import { useAppDispatch } from '@/store'; //selectSwapViewState selectSwapViewState, useAppSelector
import { parseResponseTokenList } from '@/utils/canister';

import { usePriceStore, useSwapCanisterStore } from '..';
import { swapViewActions } from '.';
import { AppTokenMetadataListObject } from '@/models';

export const useSwapView = (method: string) => {
  const dispatch = useAppDispatch();
  const { icpPrice } = usePriceStore();
  const { allPairs, supportedTokenList } = useSwapCanisterStore();

  const [isPairLoaded, setIsPairLoad] = useState<boolean>(false);
  var tokenListTemp: AppTokenMetadataListObject = {};

  useEffect(() => {
    if (!supportedTokenList) return;
    tokenListTemp = parseResponseTokenList([getICPTokenMetadata(icpPrice), ...supportedTokenList]);
    if (method == 'swap') {
      delete tokenListTemp.ICP;
    } else if (method == 'mint') {
      tokenListTemp = {
        ICP: tokenListTemp.ICP,
        "utozz-siaaa-aaaam-qaaxq-cai": tokenListTemp["utozz-siaaa-aaaam-qaaxq-cai"],
        "aanaa-xaaaa-aaaah-aaeiq-cai": tokenListTemp["aanaa-xaaaa-aaaah-aaeiq-cai"],
      };
    }
    dispatch(swapViewActions.setTokenList(tokenListTemp));

    const setInitToken = async () => {
      await dispatch(swapViewActions.setAllPairs(allPairs));
      setIsPairLoad(true);
    }

    if (allPairs && Object.keys(tokenListTemp)) {
      setInitToken();
    }

  }, [allPairs, supportedTokenList, dispatch, icpPrice]);

  useEffect(() => {
    if (method == 'mint') {
      dispatch(swapViewActions.setToken({ data: 'from', tokenId: 'ICP' }));
      dispatch(swapViewActions.setValue({ data: 'from', value: '' }));
      dispatch(swapViewActions.setValue({ data: 'to', value: '' }));
    }
    tokenListTemp = parseResponseTokenList([...supportedTokenList || []]);
    if (!isPairLoaded || !tokenListTemp) return;
    if (method == 'swap') {
      const temp = Object.keys(tokenListTemp)[0];
      dispatch(swapViewActions.setToken({ data: "from", tokenId: tokenListTemp[temp]?.id }));
      dispatch(swapViewActions.setValue({ data: 'from', value: '' }));
      dispatch(swapViewActions.setValue({ data: 'to', value: '' }));
    }
  }, [isPairLoaded, method])
};