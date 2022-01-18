import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FeatureState, RootState } from '@/store';

export interface CyclesMintingCanisterState {
  ICPXDRconversionRate?: string;
  ICPXDRconversionRateState: FeatureState;
}

const initialState: CyclesMintingCanisterState = {
  ICPXDRconversionRate: undefined,
  ICPXDRconversionRateState: 'idle' as FeatureState,
};

export const cyclesMintingCanisterSlice = createSlice({
  name: 'cyclesCanister',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setICPXDRConversionRate: (state, action: PayloadAction<string>) => {
      state.ICPXDRconversionRate = action.payload;
    },
    setICPXDRConversionRateState: (
      state,
      action: PayloadAction<FeatureState>
    ) => {
      state.ICPXDRconversionRateState = action.payload;
    },
  },
});

export const cyclesMintingCanisterSliceActions =
  cyclesMintingCanisterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCyclesMintingCanisterState = (state: RootState) =>
  state.cyclesMinting;

export default cyclesMintingCanisterSlice.reducer;
