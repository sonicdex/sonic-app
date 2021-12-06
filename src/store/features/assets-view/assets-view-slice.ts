import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';

export enum AssetStep {
  Home,
  Deposit,
  Withdraw,
}

interface AssetsViewState {
  step: AssetStep;
  state: FeatureState;
  selectedTokenName?: string;
}

const initialState: AssetsViewState = {
  step: AssetStep?.Home,
  state: FeatureState?.Idle,
  selectedTokenName: undefined,
};

export const assetsViewSlice = createSlice({
  name: 'assets',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<AssetStep>) => {
      state.step = action.payload;
    },
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setSelectedTokenName: (state, action: PayloadAction<string>) => {
      state.selectedTokenName = action.payload;
    },
  },
});

export const assetsViewActions = assetsViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAssetsViewState = (state: RootState) => state.assetsView;

export default assetsViewSlice.reducer;
