import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { FeatureState } from '@/store';

interface TransferViewState {
  state: FeatureState;
  amount: string;
  tokenId?: string;
  accountId?: string;
  principalId?: string;
}

const initialState: TransferViewState = {
  state: FeatureState?.Idle,
  amount: '',
  tokenId: undefined,
  accountId: undefined,
  principalId: undefined,
};

export const transferViewSlice = createSlice({
  name: 'transfer',
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
    setAccountId: (state, action: PayloadAction<string>) => {
      state.accountId = action.payload;
    },
    setPrincipalId: (state, action: PayloadAction<string>) => {
      state.principalId = action.payload;
    },
  },
});

export const transferViewActions = transferViewSlice.actions;
export const selectTransferViewState = (state: RootState) => state.transferView;
export default transferViewSlice.reducer;
