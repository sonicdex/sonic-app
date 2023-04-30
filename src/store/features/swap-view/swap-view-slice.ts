import { MaximalPaths, Pair, Swap } from '@memecake/sonic-js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ENV } from '@/config';
import { ICP_METADATA } from '@/constants';
import { AppTokenMetadata, AppTokenMetadataListObject, BaseTokenData } from '@/models';

import { FeatureState, RootState } from '@/store';
import { capitalize } from '@/utils/format';
import { getAmountOutFromPath } from '@/views';

// import BigNumber from 'bignumber.js';

export type SwapTokenDataKey = 'from' | 'to';

export interface SwapTokenData<M = AppTokenMetadata> extends BaseTokenData<M> {
  paths: MaximalPaths.PathList;
}

interface SwapViewState {
  state: FeatureState;
  from: SwapTokenData;
  to: SwapTokenData;
  tokenList?: AppTokenMetadataListObject;
  allPairs?: Pair.List;
  slippage: string;
  keepInSonic: boolean;
  baseFromTokenPaths: MaximalPaths.PathList;
  baseToTokenPaths: MaximalPaths.PathList;
  allowance?: number;
}

export const INITIAL_SWAP_SLIPPAGE = '0.5';
function toJson(data: any) {
  if(data) return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}n` : v).replace(/"(-?\d+)n"/g, (_, a) => a);
  return '{}';
}
const initialState: SwapViewState = {
  state: FeatureState?.Idle,
  from: { paths: {}, metadata: undefined, value: '' },
  to: { paths: {}, metadata: undefined, value: '' },
  tokenList: undefined,
  allPairs: undefined,
  slippage: INITIAL_SWAP_SLIPPAGE,
  keepInSonic: false,
  baseFromTokenPaths: {},
  baseToTokenPaths: {},
  allowance: undefined,
};
export const swapViewSlice = createSlice({
  name: 'swap',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: (state) => {
      
    },
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setValue: (state, action: PayloadAction<{ data: SwapTokenDataKey; value: string }>) => {
      const { allPairs, tokenList } = state;
      const { data, value } = action.payload;

      const metadata = data === 'from' ? state.from.metadata : state.to.metadata;
      const oppositeMetadata = data === 'to' ? state.from.metadata : state.to.metadata;

      const oppositeDataKey = data === 'from' ? 'to' : 'from';
      state[data].value = value;
      if (tokenList && metadata && oppositeMetadata && !(metadata.id === ICP_METADATA.id) && !(oppositeMetadata.id === ICP_METADATA.id)) {
        const paths: any = getTokenPaths(allPairs as Pair.List, tokenList, metadata.id, state[data].value, data);

        // Swap.getTokenPaths({
        //   pairList: allPairs as Pair.List, tokenList, tokenId: metadata.id, amount: value, dataKey: data,
        // });
        state[data].paths = paths;

        state[oppositeDataKey].value = getAmountOutFromPath(state[data] as SwapTokenData, state[oppositeDataKey] as SwapTokenData);

        if (data === 'to' && paths[oppositeMetadata.id]) {
          state.from.paths[metadata.id] = { amountOut: paths[oppositeMetadata.id].amountOut, path: [...paths[oppositeMetadata.id].path].reverse() };
        }
      }
    },
    setToken: (state, action: PayloadAction<{ data: SwapTokenDataKey; tokenId: string | undefined }>) => {
      const { allPairs, tokenList } = state;
      const { data, tokenId } = action.payload;

      if (tokenId && tokenList && allPairs) {
        const paths = getTokenPaths(allPairs as Pair.List, tokenList, tokenId, state[data].value, data);
        // const paths = //Swap.getTokenPaths({ pairList: allPairs as Pair.List, tokenList, tokenId, amount: state[data].value, dataKey: data });  
        state[data].metadata = { ...tokenList[tokenId] };
        state[data].paths = paths;
        const tokenPathsDataKey = `base${capitalize(data)}TokenPaths` as | 'baseToTokenPaths' | 'baseFromTokenPaths';

        state[tokenPathsDataKey] = getTokenPaths(allPairs as Pair.List, tokenList, tokenId, state[data].value, data);
        // Swap.getTokenPaths({ pairList: allPairs as Pair.List, tokenList, tokenId, dataKey: data });

      } else { state[data].metadata = undefined; }
      if (data === 'from') {
        state.to.metadata = undefined;
        state.to.value = '';
      }
    },
    switchTokens: (state, action: PayloadAction<SwapTokenDataKey>) => {
      const dataKey = action.payload;
      const oppositeDataKey = dataKey === 'from' ? 'to' : 'from';
      const oppositeMetadata = state[oppositeDataKey].metadata;

      if (state.from.metadata && state.to.metadata && oppositeMetadata && state.tokenList && state.allPairs) {
        // FIXME: Handle WICP/ICP specific case better/in other place

        const isICPToWICPPair = state.from.metadata.id === ICP_METADATA.id && state.to.metadata.id === ENV.canistersPrincipalIDs.WICP;

        const isWICPToICPPair = state.to.metadata.id === ICP_METADATA.id && state.from.metadata.id === ENV.canistersPrincipalIDs.WICP;

        const isWICPAndICPPair = isICPToWICPPair || isWICPToICPPair;

        const value = state[dataKey].value;

        // const oppositeTokenPaths = Swap.getTokenPaths({
        //   pairList: state.allPairs as Pair.List,
        //   tokenList: state.tokenList,
        //   tokenId: state[dataKey].metadata!.id,
        //   amount: value,
        //   dataKey: oppositeDataKey,
        // });

        const oppositeTokenPaths = getTokenPaths(state.allPairs as Pair.List, state.tokenList, state[dataKey].metadata!.id, value, oppositeDataKey);

        const oppositeValue = getAmountOutFromPath( { ...state[dataKey], paths: oppositeTokenPaths },state[oppositeDataKey] as SwapTokenData );

        // const tokenPaths = Swap.getTokenPaths({
        //   pairList: state.allPairs as Pair.List,
        //   tokenList: state.tokenList,
        //   tokenId: state[oppositeDataKey].metadata!.id,
        //   amount: oppositeValue,
        //   dataKey: dataKey,
        // });

        const tokenPaths = getTokenPaths(state.allPairs as Pair.List, state.tokenList, state[oppositeDataKey].metadata!.id, oppositeValue, dataKey);

        const tempMetadata = { ...state.from.metadata };
        state.from.metadata = { ...state.to.metadata };
        state.to.metadata = tempMetadata;

        // In case of WICP/ICP or ICP/WICP switch -- leave values as they are
        if (!isWICPAndICPPair) {
          state[oppositeDataKey].paths = oppositeTokenPaths;
          state[dataKey].paths = tokenPaths;

          state[oppositeDataKey].value = value;
          state[dataKey].value = oppositeValue;

          const baseFromPaths = getTokenPaths(state.allPairs as Pair.List, state.tokenList, state.from.metadata.id);

          // Swap.getTokenPaths({ pairList: state.allPairs as Pair.List,   tokenList: state.tokenList, tokenId: state.from.metadata.id });
          
          const baseToPaths = getTokenPaths(state.allPairs as Pair.List, state.tokenList, state.to.metadata.id);
          
          //Swap.getTokenPaths({ pairList: state.allPairs as Pair.List, tokenList: state.tokenList,tokenId: state.to.metadata.id, });

          state.baseFromTokenPaths = baseFromPaths;
          state.baseToTokenPaths = baseToPaths;
        }
      }
    },
    setTokenList: ( state, action: PayloadAction<AppTokenMetadataListObject>) => {
      state.tokenList = action.payload;
      const tokens = Object.values(action.payload);
      if (!state.from.metadata) {
        state.from.metadata = { ...tokens[0] };
        state.from.paths = {};
        state.from.value = '';
        state.to.value = '';
        if(state.from.metadata.id){
          const { allPairs, tokenList } = state;
          state.from.paths =  getTokenPaths(allPairs as Pair.List, tokenList, state.from.metadata.id, 0, "from");
        }
      }
    
    },
    setAllPairs: (state, action: PayloadAction<Pair.List | undefined>) => {
      state.allPairs = action.payload;
    },
    setSlippage: (state, action: PayloadAction<string>) => {
      state.slippage = action.payload;
    },
    setKeepInSonic: (state, action: PayloadAction<boolean>) => {
      state.keepInSonic = action.payload;
    },
    setAllowance: (state, action: PayloadAction<number | undefined>) => {
      state.allowance = action.payload;
    },
  },
});

export const swapViewActions = swapViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export const selectSwapViewState = (state: RootState) => state.swapView;


//getTokenPaths to avoid cpu load in built fn

const getTokenPaths = function(allPairs?: any, tokenList?: any, tokenId?: string, amount?: any, dataKey?: any) {
  var allPairs = JSON.parse(toJson(allPairs)), tokenList = JSON.parse(toJson(tokenList)),tokenPaths: any = {};

  if (tokenId) {
    if(!allPairs[tokenId] ) return tokenPaths;
    Object.keys(allPairs[tokenId]).forEach((x: string) => {
      let fromValue = amount ? amount : 0;
      var p = Swap.getAmountOut({ 
        amountIn: fromValue.toString(),decimalsIn: tokenList[tokenId]?.decimals, decimalsOut: tokenList[x]?.decimals,
        reserveIn: allPairs[tokenId][x].reserve0,reserveOut: allPairs[tokenId][x].reserve1,
      })
      tokenPaths[x] = { amountOut: p, path: [tokenId, x] ,  }
    })
  }
  return tokenPaths;
}
export const getTokenPath = getTokenPaths;
export default swapViewSlice.reducer;
