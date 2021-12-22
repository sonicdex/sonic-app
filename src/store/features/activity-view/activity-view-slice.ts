import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { TokenMetadataList } from '@/models';
import { MappedCapHistoryLog } from '@/integrations/cap';

interface ActivityViewState {
  state: FeatureState;
  tokenList?: TokenMetadataList;
  activityList: { [date: string]: MappedCapHistoryLog[] };
}

const initialState: ActivityViewState = {
  state: FeatureState?.Idle,
  activityList: {},
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
    pushActivityList: (state, action: PayloadAction<MappedCapHistoryLog[]>) => {
      state.activityList = action.payload.reduce((acc, cur) => {
        const date = new Date(cur.time).toDateString();
        acc[date] = [...(acc[date] || []), cur];
        return acc;
      }, {} as any);
    },
  },
});

export const activityViewActions = activityViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectActivityViewState = (state: RootState) => state.activityView;

export default activityViewSlice.reducer;
