import { useEffect, useMemo } from 'react';

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

  var tokenListTemp: AppTokenMetadataListObject = {};


  useEffect(() => {
    const getTokenList = async () => {
      if (!supportedTokenList) return;
      tokenListTemp = parseResponseTokenList([getICPTokenMetadata(icpPrice), ...supportedTokenList]);
      if (method === "swap" && tokenListTemp.ICP) delete tokenListTemp.ICP;
      else if (method === "mint") {
        tokenListTemp = {
          ICP: tokenListTemp.ICP,
          "utozz-siaaa-aaaam-qaaxq-cai": tokenListTemp["utozz-siaaa-aaaam-qaaxq-cai"],
          "aanaa-xaaaa-aaaah-aaeiq-cai": tokenListTemp["aanaa-xaaaa-aaaah-aaeiq-cai"],
        };
      }
      await dispatch(swapViewActions.setTokenList(tokenListTemp));
    }
    getTokenList();
  }, [dispatch, icpPrice, supportedTokenList]);

  const isLoaded = useMemo(() => {
    if (Object.keys(tokenListTemp ? tokenListTemp : {}).length > 0) return true;
    return false
  }, [tokenListTemp])

  useEffect(() => {
    const setInitToken = async () => {
      if (method == 'swap') {
        const temp = Object.keys(tokenListTemp)[0];
        if (tokenListTemp[temp]?.id) {
          await dispatch(swapViewActions.setToken({ data: "from", tokenId: tokenListTemp[temp].id }));
        }
      } else if (method == 'mint') {
        await dispatch(swapViewActions.setToken({ data: 'from', tokenId: 'ICP' }));
      }
    }
    if (isLoaded == true) setInitToken();
  }, [isLoaded]);
  useEffect(() => { dispatch(swapViewActions.setAllPairs(allPairs)); }, [allPairs, dispatch]);
};