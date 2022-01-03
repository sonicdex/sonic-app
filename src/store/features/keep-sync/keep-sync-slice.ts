import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState, store } from '@/store';

export const KEEP_SYNC_DEFAULT_INTERVAL = 15 * 1000;

export type KeepSync = {
  callback: (refresh?: boolean) => Promise<any>;
  interval: number;
};

type TriggerAction = {
  key: string;
  interval?: KeepSync['interval'];
};

type SetCallbackAction = {
  key: string;
  callback: KeepSync['callback'];
};

// Define a type for the slice state
interface KeepSyncState {
  timers: {
    [key: string]: NodeJS.Timeout;
  };
  callbacks: {
    [key: string]: KeepSync['callback'];
  };
}

// Define the initial state using that type
const initialState: KeepSyncState = {
  timers: {},
  callbacks: {},
};

export const keepSyncSlice = createSlice({
  name: 'keepSync',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    trigger: (state, action: PayloadAction<TriggerAction>) => {
      const { key, interval = KEEP_SYNC_DEFAULT_INTERVAL } = action.payload;

      if (state.timers[key]) clearInterval(state.timers[key]);
      state.timers[key] = setInterval(() => {
        store.getState().keepSync.callbacks[key](true);
      }, interval);
    },
    setCallback: (state, action: PayloadAction<SetCallbackAction>) => {
      const { key, callback } = action.payload;
      state.callbacks[key] = callback;
    },
  },
});

export const keepSyncActions = keepSyncSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectKeepSyncState = (state: RootState) => state.keepSync;

export default keepSyncSlice.reducer;
