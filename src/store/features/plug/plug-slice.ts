import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';

import { connect, disconnect } from './async-thunk';

export enum PlugState {
  NotInstalled,
  Disconnected,
  Loading,
  Connected,
}

interface PlugStoreState {
  state: PlugState;
  principalId?: string;
  isConnected: boolean;
}

const initialState: PlugStoreState = {
  principalId: undefined,
  state: PlugState.Disconnected,
  isConnected: false,
};

export const plugSlice = createSlice({
  name: 'plug',
  initialState,
  reducers: {
    setPrincipalId: (state, action: PayloadAction<string>) => {
      state.state = PlugState.Connected;
      state.principalId = action.payload;
      state.isConnected = true;
    },
    setState: (
      state,
      action: PayloadAction<
        PlugState.Disconnected | PlugState.Loading | PlugState.NotInstalled
      >
    ) => {
      state.state = action.payload;
      state.principalId = undefined;
      state.isConnected = false;
    },
  },
});

export const plugActions = { ...plugSlice.actions, connect, disconnect };

const selectPlugState = (state: RootState): PlugStoreState => state.plug;

export const usePlugStore = (): PlugStoreState =>
  useAppSelector(selectPlugState);

export default plugSlice.reducer;
