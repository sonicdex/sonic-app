import { useEffect } from 'react';

import { getICPTokenMetadata } from '@/constants';
import { useAppDispatch } from '@/store';
import { parseResponseTokenList } from '@/utils/canister';

import { usePriceStore, useSwapCanisterStore } from '..';
import { swapViewActions } from '.';

export const useSwapView = (methode:string) => {
  const dispatch = useAppDispatch();

  dispatch(swapViewActions.reset());
  
  const { icpPrice } = usePriceStore();
  const { allPairs, supportedTokenList } = useSwapCanisterStore();

  useEffect(() => {
    if (!supportedTokenList) return;
    var tokenList = parseResponseTokenList([ getICPTokenMetadata(icpPrice),...supportedTokenList]);
    if(methode=='swap'){
      if(tokenList.ICP) delete tokenList.ICP;
    }
    else if(methode == 'mint'){
      tokenList = {
         'ICP' : tokenList.ICP, 
         'aanaa-xaaaa-aaaah-aaeiq-cai':tokenList['aanaa-xaaaa-aaaah-aaeiq-cai'], 
         'utozz-siaaa-aaaam-qaaxq-cai':  tokenList['utozz-siaaa-aaaam-qaaxq-cai']
       }
    }
   // console.log(tokenList)
    dispatch(swapViewActions.setTokenList(tokenList));
  }, [dispatch, icpPrice, supportedTokenList]);


  useEffect(() => {
    dispatch(swapViewActions.setAllPairs(allPairs));
  }, [allPairs, dispatch]);
};