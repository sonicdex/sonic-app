import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ICP_METADATA } from '@/constants';
import {
  AppTokenMetadata,
  AppTokenMetadataListObject,
  BaseTokenData,
  PairList,
} from '@/models';
import { FeatureState, RootState } from '@/store';
import { capitalize, getSwapAmountOut } from '@/utils/format';
import { getTokenPaths, MaximalPathsList } from '@/utils/maximal-paths';

export type SwapTokenDataKey = 'from' | 'to';

export interface SwapTokenData<M = AppTokenMetadata> extends BaseTokenData<M> {
  paths: MaximalPathsList;
}

interface SwapViewState {
  state: FeatureState;
  from: SwapTokenData;
  to: SwapTokenData;
  tokenList?: AppTokenMetadataListObject;
  allPairs?: PairList;
  slippage: string;
  keepInSonic: boolean;
  baseFromTokenPaths: MaximalPathsList;
  baseToTokenPaths: MaximalPathsList;
}

export const INITIAL_SWAP_SLIPPAGE = '0.5';

const initialState: SwapViewState = {
  state: FeatureState?.Idle,
  from: {
    paths: {},
    metadata: undefined,
    value: '',
  },
  to: {
    paths: {},
    metadata: undefined,
    value: '',
  },
  tokenList: undefined,
  allPairs: undefined,
  slippage: INITIAL_SWAP_SLIPPAGE,
  keepInSonic: true,
  baseFromTokenPaths: {},
  baseToTokenPaths: {},
};

export const swapViewSlice = createSlice({
  name: 'swap',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setValue: (
      state,
      action: PayloadAction<{ data: SwapTokenDataKey; value: string }>
    ) => {
      const { allPairs, tokenList } = state;
      const { data, value } = action.payload;

      const metadata =
        data === 'from' ? state.from.metadata : state.to.metadata;
      const oppositeMetadata =
        data === 'to' ? state.from.metadata : state.to.metadata;

      const oppositeDataKey = data === 'from' ? 'to' : 'from';

      if (allPairs && tokenList && metadata) {
        const paths = getTokenPaths({
          pairList: allPairs as PairList,
          tokenList,
          tokenId: metadata.id,
          amount: value,
        });
        state[data].paths = paths;
      }

      state[data].value = value;

      if (
        !(metadata?.id === ICP_METADATA.id) &&
        !(oppositeMetadata?.id === ICP_METADATA.id)
      ) {
        state[oppositeDataKey].value = getSwapAmountOut(
          state[data],
          state[oppositeDataKey]
        );
      }
    },
    setToken: (
      state,
      action: PayloadAction<{
        data: SwapTokenDataKey;
        tokenId: string | undefined;
      }>
    ) => {
      const { allPairs, tokenList } = state;
      const { data, tokenId } = action.payload;
      if (tokenId && tokenList && allPairs) {
        const paths = getTokenPaths({
          pairList: allPairs as PairList,
          tokenList,
          tokenId,
          amount: state[data].value,
          dataKey: data,
        });

        state[data].metadata = {
          ...tokenList[tokenId],
        };
        state[data].paths = paths;
        const tokenPathsDataKey = `base${capitalize(data)}TokenPaths` as
          | 'baseToTokenPaths'
          | 'baseFromTokenPaths';

        state[tokenPathsDataKey] = getTokenPaths({
          pairList: allPairs as PairList,
          tokenList,
          tokenId,
        });
      } else {
        state[data].metadata = undefined;
      }
      if (data === 'from') {
        state.to.value = '';
        state.to.metadata = undefined;
      }
    },
    switchTokens: (state) => {
      if (
        state.from.metadata &&
        state.to.metadata &&
        state.tokenList &&
        state.allPairs
      ) {
        const tempMetadata = { ...state.from.metadata };
        const tempValue = state.from.value;

        const fromPaths = getTokenPaths({
          pairList: state.allPairs as PairList,
          tokenList: state.tokenList,
          tokenId: state.to.metadata.id,
          amount: state.to.value,
        });

        const toPaths = getTokenPaths({
          pairList: state.allPairs as PairList,
          tokenList: state.tokenList,
          tokenId: state.from.metadata.id,
          amount: state.from.value,
        });

        const baseFromTokenPaths = getTokenPaths({
          pairList: state.allPairs as PairList,
          tokenList: state.tokenList,
          tokenId: state.to.metadata.id,
        });
        const baseToTokenPaths = getTokenPaths({
          pairList: state.allPairs as PairList,
          tokenList: state.tokenList,
          tokenId: state.from.metadata.id,
        });

        state.from.metadata = { ...state.to.metadata };
        state.from.value = state.to.value;
        state.from.paths = fromPaths;
        state.baseFromTokenPaths = baseFromTokenPaths;

        state.to.metadata = tempMetadata;
        state.to.value = tempValue;
        state.to.paths = toPaths;
        state.baseToTokenPaths = baseToTokenPaths;
      }
    },
    setTokenList: (
      state,
      action: PayloadAction<AppTokenMetadataListObject>
    ) => {
      state.tokenList = action.payload;
      const tokens = Object.values(action.payload);
      if (!state.from.metadata) {
        state.from.metadata = { ...tokens[0] };
        state.from.paths = {};
        state.from.value = '';
        state.to.value = '';
      }
    },
    setAllPairs: (state, action: PayloadAction<PairList | undefined>) => {
      state.allPairs = action.payload;
    },
    setSlippage: (state, action: PayloadAction<string>) => {
      state.slippage = action.payload;
    },
    setKeepInSonic: (state, action: PayloadAction<boolean>) => {
      state.keepInSonic = action.payload;
    },
  },
});

export const swapViewActions = swapViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapViewState = (state: RootState) => state.swapView;

export default swapViewSlice.reducer;
