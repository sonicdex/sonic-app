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
  ledgerTransactions: LedgerTransaction[];
  activityList: { [date: string]: ActivityEvent[] };
  page?: number;
  lastPage?: number;
  fetchedPages: number[];
}

const initialState: ActivityViewState = {
  CAPstate: FeatureState?.Idle,
  LedgerState: FeatureState?.Idle,
  ledgerTransactions: [],
  activityList: {},
  page: undefined,
  lastPage: undefined,
  fetchedPages: [],
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
    setLedgerTransactions: (
      state,
      action: PayloadAction<LedgerTransaction[]>
    ) => {
      state.ledgerTransactions = action.payload;
    },
    pushActivityList: (state, action: PayloadAction<MappedCapHistoryLog[]>) => {
      const mergedTransactions = [
        ...action.payload,
        ...state.ledgerTransactions,
      ] as ActivityEvent[];
      const toFilterTransactions = mergedTransactions.reduce((acc, cur) => {
        if ('timestamp' in cur) {
          const dateString = cur['timestamp'].toDateString();
          if (acc[dateString] || state.page === 0) {
            acc[dateString] = [...(acc[dateString] || []), cur];
          }
        } else {
          const dateString = new Date(cur['time']).toDateString();

          acc[dateString] = [...(acc[dateString] || []), cur];
        }

        return acc;
      }, state.activityList);

      for (const key in toFilterTransactions) {
        const alreadyAdded = new Set();
        toFilterTransactions[key] = toFilterTransactions[key]
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

      state.activityList = toFilterTransactions;
    },
    setLastPage: (state, action: PayloadAction<number>) => {
      state.lastPage = action.payload;
      if (typeof state.page === 'undefined') {
        state.page = action.payload;
      }
    },
    pushFetchedPages: (state, action: PayloadAction<number>) => {
      state.fetchedPages = Array.from(
        new Set([...state.fetchedPages, action.payload])
      );
    },
    clearActivityList: (state) => {
      state.activityList = {};
      state.ledgerTransactions = [];
      state.page = undefined;
      state.lastPage = undefined;
      state.fetchedPages = [];
    },
  },
});

export const activityViewActions = activityViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectActivityViewState = (state: RootState) => state.activityView;

export default activityViewSlice.reducer;
