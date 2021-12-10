import { TokenMetadataList } from '@/models';
import { PairList } from '@/models/pair';
import { SwapDataKey, SwapData } from '@/models/swap';
import type { RootState } from '@/store';
import { FeatureState } from '@/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum SwapStep {
  Home,
  Review,
}

interface SwapViewState {
  step: SwapStep;
  state: FeatureState;
  from: SwapData;
  to: SwapData;
  tokenList?: TokenMetadataList;
  pairList?: PairList;
}

const initialState: SwapViewState = {
  step: SwapStep?.Home,
  state: FeatureState?.Idle,
  from: {
    token: undefined,
    value: '0.00',
  },
  to: {
    token: undefined,
    value: '0.00',
  },
  tokenList: undefined,
  pairList: undefined,
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
      action: PayloadAction<{ data: SwapDataKey; value: string }>
    ) => {
      state[action.payload.data].value = action.payload.value;
      state.step = SwapStep.Home;
    },
    setToken: (
      state,
      action: PayloadAction<{ data: SwapDataKey; tokenId: string | undefined }>
    ) => {
      state[action.payload.data].token =
        action.payload.tokenId && state.tokenList
          ? state.tokenList[action.payload.tokenId]
          : undefined;
      if (action.payload.data === 'from') state.to.token = undefined;
      state.step = SwapStep.Home;
    },
    switchTokens: (state) => {
      const temp = state.from.token;
      state.from.token = state.to.token;
      state.to.token = temp;
      state.step = SwapStep.Home;
    },
    setTokenList: (state, action: PayloadAction<TokenMetadataList>) => {
      state.tokenList = action.payload;
      const tokens = Object.values(action.payload);
      state.from.token = tokens[0];
      state.from.value = '0.00';
      state.to.value = '0.00';
      state.step = SwapStep.Home;
    },
    setPairList: (state, action: PayloadAction<PairList>) => {
      state.pairList = action.payload;
      state.step = SwapStep.Home;
    },
  },
});

export const swapViewActions = swapViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapViewState = (state: RootState) => state.swapView;

export default swapViewSlice.reducer;
