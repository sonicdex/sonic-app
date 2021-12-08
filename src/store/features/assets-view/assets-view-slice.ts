import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';

interface AssetsViewState {
  state: FeatureState;
  depositValue: string;
  withdrawValue: string;
}

const initialState: AssetsViewState = {
  state: FeatureState?.Idle,
  depositValue: '',
  withdrawValue: '',
};

export const assetsViewSlice = createSlice({
  name: 'assets',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setDepositValue: (state, action: PayloadAction<string>) => {
      state.depositValue = action.payload;
    },
    setWithdrawValue: (state, action: PayloadAction<string>) => {
      state.withdrawValue = action.payload;
    },
  },
});

export const assetsViewActions = assetsViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAssetsViewState = (state: RootState) => state.assetsView;

export default assetsViewSlice.reducer;
