import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { SwapIDL } from '@/did';
import { Balances } from '@/models';

interface SwapState {
  state: FeatureState;
  balancesState: FeatureState;
  supportedTokenList?: SwapIDL.TokenInfoExt[];
  sonicBalances?: Balances;
  tokenBalances?: Balances;
}

const initialState: SwapState = {
  state: 'loading' as FeatureState,
  balancesState: 'loading' as FeatureState,
  supportedTokenList: undefined,
  sonicBalances: undefined,
  tokenBalances: undefined,
};

export const swapSlice = createSlice({
  name: 'swap',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setBalancesState: (state, action: PayloadAction<FeatureState>) => {
      state.balancesState = action.payload;
    },
    setSupportedTokenList: (
      state,
      action: PayloadAction<SwapIDL.TokenInfoExt[]>
    ) => {
      state.supportedTokenList = action.payload;
    },
    setSonicBalances: (
      state,
      action: PayloadAction<[string, bigint][] | undefined>
    ) => {
      const parsedBalances = action.payload?.reduce((acc, current) => {
        return {
          ...acc,
          [current[0]]: Number(current[1]),
        };
      }, {} as Balances);
      state.sonicBalances = parsedBalances;
    },
    setTokenBalances: (
      state,
      action: PayloadAction<[string, bigint][] | undefined>
    ) => {
      const parsedBalances = action.payload?.reduce((acc, current) => {
        return {
          ...acc,
          [current[0]]: Number(current[1]),
        };
      }, {} as Balances);
      state.tokenBalances = parsedBalances;
    },
  },
});

export const swapActions = swapSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapState = (state: RootState) => state.swap;

export default swapSlice.reducer;
