import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';

interface DepositViewState {
  state: FeatureState;
  value: string;
  tokenId?: string;
}

const initialState: DepositViewState = {
  state: FeatureState?.Idle,
  value: '',
  tokenId: undefined,
};

export const depositViewSlice = createSlice({
  name: 'deposit',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    setTokenId: (state, action: PayloadAction<string>) => {
      state.tokenId = action.payload;
    },
  },
});

export const depositViewActions = depositViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDepositViewState = (state: RootState) => state.depositView;

export default depositViewSlice.reducer;
