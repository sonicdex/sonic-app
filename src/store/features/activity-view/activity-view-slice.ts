import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';

interface ActivityViewState {
  state: FeatureState;
}

const initialState: ActivityViewState = {
  state: FeatureState?.Idle,
};

export const activityViewSlice = createSlice({
  name: 'activity',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
  },
});

export const { setState: setActivityViewState } = activityViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectActivityViewState = (state: RootState) => state.activityView;

export default activityViewSlice.reducer;
