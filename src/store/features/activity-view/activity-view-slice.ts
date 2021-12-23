import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { TokenMetadataList } from '@/models';
import { MappedCapHistoryLog } from '@/integrations/cap';

interface ActivityViewState {
  state: FeatureState;
  tokenList?: TokenMetadataList;
  activityList: { [date: string]: MappedCapHistoryLog[] };
  page: number;
  endReached: boolean;
}

const initialState: ActivityViewState = {
  state: FeatureState?.Idle,
  activityList: {},
  page: 0,
  endReached: false,
};

export const activityViewSlice = createSlice({
  name: 'activity',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setTokenList: (state, action: PayloadAction<TokenMetadataList>) => {
      state.tokenList = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    pushActivityList: (state, action: PayloadAction<MappedCapHistoryLog[]>) => {
      const aux = action.payload.reduce((acc, cur) => {
        const date = new Date(cur.time).toDateString();
        acc[date] = [...(acc[date] || []), cur];
        return acc;
      }, state.activityList);

      for (const key in aux) {
        const alreadyAdded = new Set();
        aux[key] = aux[key].filter((item) => {
          if (alreadyAdded.has(item.time)) {
            return false;
          }
          alreadyAdded.add(item.time);
          return true;
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
