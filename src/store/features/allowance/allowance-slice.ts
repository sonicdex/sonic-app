import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';

import { fetchAllowance } from './async-thunk';

interface TokenAllowance {
  allowance: number;
  expiration: number;
}

interface AllowanceState {
  tokensAllowance: { [tokenId: string]: TokenAllowance };
}

const initialState: AllowanceState = {
  tokensAllowance: {},
};

export const allowanceSlice = createSlice({
  name: 'allowance',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAllowance: (state, action) => {
      const { tokenId, allowance, expiration } = action.payload;
      state.tokensAllowance[tokenId] = { allowance, expiration };
    },
    clearAllowance: (state, action) => {
      const { tokenId } = action.payload;
      const { [tokenId]: _, ...rest } = state.tokensAllowance;
      state.tokensAllowance = rest;
    },
  },
});

export const allowanceActions = { ...allowanceSlice.actions, fetchAllowance };

// Other code such as selectors can use the imported `RootState` type
export const selectAllowanceState = (state: RootState) => state.allowance;

export const useAllowanceStore = (): AllowanceState =>
  useAppSelector(selectAllowanceState);

export default allowanceSlice.reducer;
