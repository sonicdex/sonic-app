import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TokenData, TokenMetadataList } from '@/models';
import type { RootState } from '@/store';
import { FeatureState } from '@/store';

export type SwapTokenDataKey = 'from' | 'to';

export enum SwapStep {
  Home,
  Review,
}

interface SwapViewState {
  step: SwapStep;
  state: FeatureState;
  from: TokenData;
  to: TokenData;
  tokenList?: TokenMetadataList;
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
      state[action.payload.data].metadata =
        action.payload.tokenId && state.tokenList
          ? state.tokenList[action.payload.tokenId]
          : undefined;
      if (action.payload.data === 'from') {
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
    setTokenList: (state, action: PayloadAction<TokenMetadataList>) => {
      state.tokenList = action.payload;
      const tokens = Object.values(action.payload);
      if (!state.from.metadata) {
        // TODO: set default token
        state.from.metadata = tokens[0];
        state.from.value = '';
        state.to.value = '';
      }
      state.step = SwapStep.Home;
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
