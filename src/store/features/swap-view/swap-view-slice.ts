import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AppTokenMetadataListObject,
  PairList,
  SwapTokenMetadata,
  TokenData,
} from '@/models';
import { RootState } from '@/store';
import { FeatureState } from '@/store';
import { getTokenPaths } from '@/utils/maximal-paths';

export type SwapTokenDataKey = 'from' | 'to';

export enum SwapStep {
  Home,
  Review,
}

interface SwapViewState {
  step: SwapStep;
  state: FeatureState;
  from: TokenData<SwapTokenMetadata>;
  to: TokenData<SwapTokenMetadata>;
  tokenList?: AppTokenMetadataListObject;
  allPairs?: PairList;
  slippage: string;
  keepInSonic: boolean;
}

export const INITIAL_SWAP_SLIPPAGE = '0.5';

const initialState: SwapViewState = {
  step: SwapStep?.Home,
  state: FeatureState?.Idle,
  from: {
    metadata: undefined,
    value: '',
  },
  to: {
    metadata: undefined,
    value: '',
  },
  tokenList: undefined,
  allPairs: undefined,
  slippage: INITIAL_SWAP_SLIPPAGE,
  keepInSonic: false,
};

export const swapViewSlice = createSlice({
  name: 'swap',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<SwapStep>) => {
      state.step = action.payload;
    },
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setValue: (
      state,
      action: PayloadAction<{ data: SwapTokenDataKey; value: string }>
    ) => {
      state[action.payload.data].value = action.payload.value;
      state.step = SwapStep.Home;
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
        const paths = getTokenPaths(allPairs as PairList, tokenList, tokenId);
        state[data].metadata = {
          ...tokenList[tokenId],
          paths,
        };
      } else {
        state[data].metadata = undefined;
      }
      if (data === 'from') {
        state.from.value = '';
        state.to.value = '';
        state.to.metadata = undefined;
      }
      state.step = SwapStep.Home;
    },
    switchTokens: (state) => {
      if (state.from.metadata && state.to.metadata) {
        const temp = state.from.metadata;
        state.from.metadata = state.to.metadata;
        state.to.metadata = temp;
        state.from.value = state.to.value;
        state.step = SwapStep.Home;
      }
    },
    setTokenList: (
      state,
      action: PayloadAction<AppTokenMetadataListObject>
    ) => {
      state.tokenList = action.payload;
      const tokens = Object.values(action.payload);
      if (!state.from.metadata) {
        state.from.metadata = { ...tokens[0], paths: {} };
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
