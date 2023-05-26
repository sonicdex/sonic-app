import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { FeatureState } from '@/store';

import {  checkAddressType } from '@/utils';
enum AddressType {
  AccountId = 'accountId',
  PrincipalId = 'principalId',
  None = 'none',
}
interface TransferViewState {
  state: FeatureState;
  amount: string;
  tokenId?: string;
  toAddress?:string;
  addressType?:AddressType
}

const initialState: TransferViewState = {
  state: FeatureState?.Idle,
  amount: '',
  tokenId: undefined,
  toAddress: '',
  addressType: AddressType.None,
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
    setToAddress: (state, action: PayloadAction<string>) => {
      state.toAddress = action.payload;
      const addressType = checkAddressType(action.payload);
      if(addressType == 'accountId' ) 
        state.addressType = AddressType.AccountId;
      else if(addressType == 'principalId' ) 
        state.addressType = AddressType.PrincipalId;
      else   state.addressType = AddressType.None
    },
  },
});

export const transferViewActions = transferViewSlice.actions;
export const selectTransferViewState = (state: RootState) => state.transferView;
export default transferViewSlice.reducer;
