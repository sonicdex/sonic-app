import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { FeatureState } from '@/store';

interface WithdrawViewState {
  state: FeatureState;
  amount: string;
  tokenId?: string;
}

const initialState: WithdrawViewState = {
  state: FeatureState?.Idle,
  amount: '',
  tokenId: undefined,
};

export const withdrawViewSlice = createSlice({
  name: 'withdraw',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setAmount: (state, action: PayloadAction<string>) => {
      state.amount = action.payload;
    },
    setTokenId: (state, action: PayloadAction<string>) => {
      state.tokenId = action.payload;
    },
  },
});

export const withdrawViewActions = withdrawViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectWithdrawViewState = (state: RootState) => state.withdrawView;

export default withdrawViewSlice.reducer;
