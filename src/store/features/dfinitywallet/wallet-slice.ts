import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';

export enum walletState {
  Idle,
  OpenWalletList,
  Disconnected,
  Loading,
  Connecting,
  Connected,
}

interface DfinityWalletStoreState {
  state: walletState;
  principalId?: string;
  accountId?:string;
  accounts?:string[];
  isConnected: boolean;
  walletConnected?:string;
  walletSelected?:string;
}

const initialState: DfinityWalletStoreState = {
  principalId: undefined,
  accountId:undefined,
  state: walletState.Idle,
  isConnected: false,
  walletConnected:undefined
};

export const walletSlice = createSlice({
  name: 'difintywallet',
  initialState,
  reducers: {
    resetWallet:(state, action:PayloadAction)=>{
      state.principalId=undefined;
      state.accountId=undefined
      state.state= walletState.Idle,
      state.isConnected=false
      state.walletConnected=undefined;
      state.walletSelected=undefined;
    },
    setWalletLoaded: (state, action: PayloadAction< { principleId: string, accountId: string , walletActive:string }>) => {
      const { principleId, accountId , walletActive } = action.payload;
      if(!principleId || !accountId ) return ;
      state.principalId = principleId;
      state.accountId = accountId;
      state.isConnected = true;
      state.walletConnected = walletActive;
      state.state = walletState.Connected;
    },
    setState: ( state, action: PayloadAction<walletState.Disconnected | walletState.Loading | walletState.Idle>) => {
      state.state = action.payload;
      state.principalId = undefined;
      state.isConnected = false;
    },
    setOnwalletList:(state , action:PayloadAction<walletState>)=>{
      state.state = action.payload;
    },
    setWalletSelected:(state , action:PayloadAction<string>)=>{
      state.walletSelected = action.payload;
    }
  },
});

export const walletActions = { ...walletSlice.actions};

const selectWalletState = (state: RootState): DfinityWalletStoreState => state.dfinityWallet;

export const useWalletStore = (): DfinityWalletStoreState =>useAppSelector(selectWalletState);

export default walletSlice.reducer;
