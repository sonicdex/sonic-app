import { useEffect, useMemo } from 'react';

import { getICPTokenMetadata } from '@/constants';
import { useAppDispatch, selectSwapViewState, useAppSelector } from '@/store'; //selectSwapViewState
import { parseResponseTokenList } from '@/utils/canister';

import { usePriceStore, useSwapCanisterStore } from '..';
import { swapViewActions } from '.';

import { AppTokenMetadataListObject } from '@/models';


export const useSwapView = (methode: string) => {
  const dispatch = useAppDispatch();
  const { icpPrice } = usePriceStore();
  const { allPairs, supportedTokenList } = useSwapCanisterStore();
  var tokenListTemp: AppTokenMetadataListObject = {};
  useEffect(() => {
    if (!supportedTokenList) return;
    tokenListTemp = parseResponseTokenList([getICPTokenMetadata(icpPrice), ...supportedTokenList]);
    if (methode == 'swap') {
      if (tokenListTemp.ICP) delete tokenListTemp.ICP;
    }
    else if (methode == 'mint') {
      tokenListTemp = {
        'ICP': tokenListTemp.ICP,
        'utozz-siaaa-aaaam-qaaxq-cai': tokenListTemp['utozz-siaaa-aaaam-qaaxq-cai'],
        'aanaa-xaaaa-aaaah-aaeiq-cai': tokenListTemp['aanaa-xaaaa-aaaah-aaeiq-cai']
      }
    }
    dispatch(swapViewActions.setTokenList(tokenListTemp));
  }, [dispatch, icpPrice, supportedTokenList]);

  var {tokenList}= useAppSelector(selectSwapViewState);
  const isLoaded = useMemo(()=>{
    if( Object.keys(tokenList?tokenList:{}).length ) return true;
    return false
  },[tokenListTemp , tokenList]) 

  useEffect(() => {
    if(isLoaded == true)
    if (methode == 'swap') {
      var temp = Object.keys(tokenListTemp)[0];
      if (tokenListTemp[temp]?.id)
        dispatch(swapViewActions.setToken({ data: 'from', tokenId: tokenListTemp[temp].id }));
    } else if (methode == 'mint') {
      dispatch(swapViewActions.setToken({ data: 'from', tokenId: 'ICP' }));
    }
  }, [isLoaded]);

  useEffect(() => { dispatch(swapViewActions.setAllPairs(allPairs));}, [allPairs, dispatch]);

};