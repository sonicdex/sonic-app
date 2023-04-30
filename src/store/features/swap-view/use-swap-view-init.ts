import { useEffect } from 'react';

import { getICPTokenMetadata } from '@/constants';
import { useAppDispatch } from '@/store'; //selectSwapViewState
import { parseResponseTokenList } from '@/utils/canister';

import { usePriceStore, useSwapCanisterStore } from '..';
import { swapViewActions } from '.';

//import { AppTokenMetadataListObject } from '@/models';


export const useSwapView = (method: string) => {
  const dispatch = useAppDispatch();
  const { icpPrice } = usePriceStore();
  const { allPairs, supportedTokenList } = useSwapCanisterStore();

  useEffect(() => {
    const getTokenList = async () => {
      if (!supportedTokenList) return;

      let tokenListTemp = parseResponseTokenList([getICPTokenMetadata(icpPrice), ...supportedTokenList]);

      if (method === "swap" && tokenListTemp.ICP) delete tokenListTemp.ICP;
      else if (method === "mint") {
        tokenListTemp = {
          ICP: tokenListTemp.ICP,
          "utozz-siaaa-aaaam-qaaxq-cai": tokenListTemp["utozz-siaaa-aaaam-qaaxq-cai"],
          "aanaa-xaaaa-aaaah-aaeiq-cai": tokenListTemp["aanaa-xaaaa-aaaah-aaeiq-cai"],
        };
      }

      await dispatch(swapViewActions.setTokenList(tokenListTemp));
      
      if (method === "swap") {
        const temp = Object.keys(tokenListTemp)[0];
        if (tokenListTemp[temp]?.id) {
          await dispatch(swapViewActions.setToken({ data: "from", tokenId: tokenListTemp[temp].id }));
        }
      } else if (method === "mint") {
        await dispatch(swapViewActions.setToken({ data: "from", tokenId: "ICP" }));
      }
    };

    getTokenList();
  }, [dispatch, icpPrice, supportedTokenList, method]);

  useEffect(() => {
    dispatch(swapViewActions.setAllPairs(allPairs));
  }, [allPairs, dispatch]);
};