import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';

interface LiquidityViewState {
  state: FeatureState;
}

const initialState: LiquidityViewState = {
  state: FeatureState?.Idle,
};

export const liquidityViewSlice = createSlice({
  name: 'liquidity',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
  },
});

export const { setState: setLiquidityViewState } = liquidityViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLiquidityViewState = (state: RootState) =>
  state.liquidityView;

export default liquidityViewSlice.reducer;
