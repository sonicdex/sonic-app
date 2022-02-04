import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MappedCapHistoryLog } from '@/integrations/cap';
import { LedgerTransaction } from '@/integrations/ledger';
import { AppTokenMetadataListObject } from '@/models';
import type { RootState } from '@/store';
import { FeatureState } from '@/store';

type ActivityEvent = MappedCapHistoryLog | LedgerTransaction;

interface ActivityViewState {
  CAPstate: FeatureState;
  LedgerState: FeatureState;
  tokenList?: AppTokenMetadataListObject;
  activityList: { [date: string]: ActivityEvent[] };
  page: number;
  endReached: boolean;
}

const initialState: ActivityViewState = {
  CAPstate: FeatureState?.Idle,
  LedgerState: FeatureState?.Idle,
  activityList: {},
  page: 0,
  endReached: false,
};

export const activityViewSlice = createSlice({
  name: 'activity',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCAPState: (state, action: PayloadAction<FeatureState>) => {
      state.CAPstate = action.payload;
    },
    setLedgerState: (state, action: PayloadAction<FeatureState>) => {
      state.LedgerState = action.payload;
    },
    setTokenList: (
      state,
      action: PayloadAction<AppTokenMetadataListObject>
    ) => {
      state.tokenList = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    pushActivityList: (state, action: PayloadAction<ActivityEvent[]>) => {
      const aux = action.payload.reduce((acc, cur) => {
        const date =
          'timestamp' in cur ? cur['timestamp'] : new Date(cur['time']);
        const dateString = date.toDateString();

        acc[dateString] = [...(acc[dateString] || []), cur];
        return acc;
      }, state.activityList);

      for (const key in aux) {
        const alreadyAdded = new Set();
        aux[key] = aux[key]
          .filter((item) => {
            const time =
              'timestamp' in item ? item['timestamp'].getTime() : item['time'];
            if (alreadyAdded.has(time)) {
              return false;
            }
            alreadyAdded.add(time);
            return true;
          })
          .sort((a, b) => {
            const timeA =
              'timestamp' in a ? a['timestamp'].getTime() : a['time'];
            const timeB =
              'timestamp' in b ? b['timestamp'].getTime() : b['time'];
            return timeB - timeA;
          });
      }

      state.activityList = aux;
    },
    setEndReached: (state) => {
      state.endReached = true;
    },
    clearActivityList: (state) => {
      state.activityList = {};
      state.page = 0;
      state.endReached = false;
    },
  },
});

export const activityViewActions = activityViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectActivityViewState = (state: RootState) => state.activityView;

export default activityViewSlice.reducer;
