import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AppTokenMetadata,
  AppTokenMetadataListObject,
  BaseTokenData,
  PairList,
} from '@/models';
import { FeatureState, RootState } from '@/store';
import { getSwapAmountOut } from '@/utils/format';
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
  baseTokenPaths: MaximalPathsList;
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
  baseTokenPaths: {},
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

      const oppositeData = data === 'from' ? 'to' : 'from';

      if (allPairs && tokenList && metadata) {
        const paths = getTokenPaths(
          allPairs as PairList,
          tokenList,
          metadata.id,
          value
        );
        state[data].paths = paths;
      }
      state[data].value = value;
      state[oppositeData].value = getSwapAmountOut(
        state[data],
        state[oppositeData]
      );
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
        const paths = getTokenPaths(
          allPairs as PairList,
          tokenList,
          tokenId,
          state.from.value
        );

        state[data].metadata = {
          ...tokenList[tokenId],
        };
        state[data].paths = paths;
        if (data === 'from') {
          state.baseTokenPaths = getTokenPaths(
            allPairs as PairList,
            tokenList,
            tokenId
          );
        }
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
        const temp = state.from.metadata;
        state.from.metadata = {
          ...state.to.metadata,
        };
        state.from.paths = getTokenPaths(
          state.allPairs as PairList,
          state.tokenList,
          state.to.metadata.id,
          state.to.value
        );
        state.to.metadata = temp;
        state.from.value = state.to.value;

        const paths = getTokenPaths(
          state.allPairs as PairList,
          state.tokenList,
          state.from.metadata.id
        );
        state.baseTokenPaths = paths;
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
