import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { SwapIDL } from '@/did';

interface SwapState {
  state: FeatureState;
  supportedTokenList?: SwapIDL.TokenInfoExt[];
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
    setSupportedTokenList: (
      state,
      action: PayloadAction<SwapIDL.TokenInfoExt[]>
    ) => {
      state.supportedTokenList = action.payload;
    },
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
  },
});

export const swapActions = swapSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapState = (state: RootState) => state.swap;

export default swapSlice.reducer;
