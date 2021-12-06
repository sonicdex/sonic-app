import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { SupportedToken, SupportedTokenList } from '@/models';

type DataKey = 'from' | 'to';
export interface SwapData {
  token?: SupportedToken;
  value: string;
}

export enum SwapStep {
  Home,
  Review,
}

interface SwapViewState {
  step: SwapStep;
  state: FeatureState;
  from: SwapData;
  to: SwapData;
  tokenList?: SupportedTokenList;
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
      action: PayloadAction<{ data: DataKey; value: string }>
    ) => {
      state[action.payload.data].value = action.payload.value;
      state.step = SwapStep.Home;
    },
    setToken: (
      state,
      action: PayloadAction<{ data: DataKey; tokenId: string | undefined }>
    ) => {
      state[action.payload.data].token =
        action.payload.tokenId && state.tokenList
          ? state.tokenList[action.payload.tokenId]
          : undefined;
      if (state.from.token?.id === state.to.token?.id && state.tokenList) {
        // Change 'to.token' if it's the same as the new 'from.token'
        const anotherTokenId = Object.keys(state.tokenList).find(
          (tokenId) => tokenId !== state.from.token?.id
        );
        state.to.token = anotherTokenId
          ? state.tokenList[anotherTokenId]
          : undefined;
      }
      state.step = SwapStep.Home;
    },
    setTokenList: (state, action: PayloadAction<SupportedTokenList>) => {
      state.tokenList = action.payload;
      const tokens = Object.values(action.payload);
      state.from.token = tokens[0];
      state.from.value = '0.00';
      state.to.token = tokens[1];
      state.to.value = '0.00';
      state.step = SwapStep.Home;
    },
  },
});

export const swapViewActions = swapViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapViewState = (state: RootState) => state.swapView;

export default swapViewSlice.reducer;
