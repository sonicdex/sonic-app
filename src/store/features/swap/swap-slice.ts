import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { SwapIDL } from '@/did';
import { Balance } from '@/models';

interface SwapState {
  state: FeatureState;
  supportedTokenList?: SwapIDL.TokenInfoExt[];
  balance?: Balance;
}

const initialState: SwapState = {
  state: 'loading' as FeatureState,
  supportedTokenList: undefined,
};

export const swapSlice = createSlice({
  name: 'swap',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setSupportedTokenList: (
      state,
      action: PayloadAction<SwapIDL.TokenInfoExt[]>
    ) => {
      state.supportedTokenList = action.payload;
    },
    setBalance: (
      state,
      action: PayloadAction<[string, bigint][] | undefined>
    ) => {
      const parsedBalances = action.payload?.reduce((acc, current) => {
        return {
          ...acc,
          [current[0]]: Number(current[1]),
        };
      }, {} as Balance);
      state.balance = parsedBalances;
    },
  },
});

export const swapActions = swapSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapState = (state: RootState) => state.swap;

export default swapSlice.reducer;
