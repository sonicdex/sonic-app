import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppTokenMetadata, Pair, TokenData } from '@/models';
import { FeatureState, RootState } from '@/store';

export type LiquidityTokenDataKey = 'token0' | 'token1';

interface LiquidityViewState {
  isBannerOpened: boolean;
  pairState: FeatureState;
  state: FeatureState;
  token0: TokenData;
  token1: TokenData;
  removeAmountPercentage: number;
  pair?: Pair;
  slippage: string;
  keepInSonic: boolean;
}

export const INITIAL_LIQUIDITY_SLIPPAGE = '0.50';

const initialState: LiquidityViewState = {
  isBannerOpened: true,
  pair: undefined,
  pairState: 'not-started' as FeatureState,
  state: 'not-started' as FeatureState,
  removeAmountPercentage: 100,
  token0: {
    metadata: undefined,
    value: '',
  },
  token1: {
    metadata: undefined,
    value: '',
  },
  slippage: INITIAL_LIQUIDITY_SLIPPAGE,
  keepInSonic: true,
};

export const liquidityViewSlice = createSlice({
  name: 'liquidity',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsBannerOpened: (state, action: PayloadAction<boolean>) => {
      state.isBannerOpened = action.payload;
    },
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setPairState: (state, action: PayloadAction<FeatureState>) => {
      state.pairState = action.payload;
    },
    setRemoveAmountPercentage: (state, action: PayloadAction<number>) => {
      state.removeAmountPercentage = action.payload;
    },
    setKeepInSonic: (state, action: PayloadAction<boolean>) => {
      state.keepInSonic = action.payload;
    },
    setValue: (
      state,
      action: PayloadAction<{ data: LiquidityTokenDataKey; value: string }>
    ) => {
      state[action.payload.data].value = action.payload.value;
    },
    setToken: (
      state,
      action: PayloadAction<{
        data: LiquidityTokenDataKey;
        token?: AppTokenMetadata;
      }>
    ) => {
      state[action.payload.data].metadata = action.payload.token;
    },
    setPair: (state, action: PayloadAction<Pair | undefined>) => {
      state.pair = action.payload;
    },
    setSlippage: (state, action: PayloadAction<string>) => {
      state.slippage = action.payload;
    },
  },
});

export const liquidityViewActions = liquidityViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLiquidityViewState = (state: RootState) =>
  state.liquidityView;

export default liquidityViewSlice.reducer;
