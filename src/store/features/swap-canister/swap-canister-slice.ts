import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState, RootState } from '@/store';
import {
  Balances,
  PairBalances,
  PairList,
  AppTokenMetadataList,
} from '@/models';

export interface SwapCanisterState {
  supportedTokenListState: FeatureState;
  balancesState: FeatureState;
  allPairsState: FeatureState;
  userLPBalancesState: FeatureState;

  supportedTokenList?: AppTokenMetadataList;
  sonicBalances?: Balances;
  tokenBalances?: Balances;
  icpBalance?: number;
  allPairs?: PairList;
  userLPBalances?: PairBalances;
}

const initialState: SwapCanisterState = {
  supportedTokenListState: 'not-started' as FeatureState,
  balancesState: 'not-started' as FeatureState,
  allPairsState: 'not-started' as FeatureState,
  userLPBalancesState: 'not-started' as FeatureState,

  supportedTokenList: undefined,
  sonicBalances: undefined,
  tokenBalances: undefined,
  icpBalance: undefined,
  allPairs: undefined,
  userLPBalances: undefined,
};

export const swapCanisterSlice = createSlice({
  name: 'swapCanister',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setICPBalance: (state, action: PayloadAction<bigint>) => {
      state.icpBalance = Number(action.payload);
    },
    setSupportedTokensListState: (
      state,
      action: PayloadAction<FeatureState>
    ) => {
      state.supportedTokenListState = action.payload;
    },
    setBalancesState: (state, action: PayloadAction<FeatureState>) => {
      state.balancesState = action.payload;
    },
    setSupportedTokenList: (
      state,
      action: PayloadAction<AppTokenMetadataList>
    ) => {
      state.supportedTokenList = action.payload;
    },
    setSonicBalances: (
      state,
      action: PayloadAction<[string, bigint][] | undefined>
    ) => {
      const parsedBalances = action.payload?.reduce((acc, current) => {
        return {
          ...acc,
          [current[0]]: Number(current[1]),
        };
      }, {} as Balances);
      state.sonicBalances = parsedBalances;
    },
    setTokenBalances: (
      state,
      action: PayloadAction<[string, bigint][] | undefined>
    ) => {
      const parsedBalances = action.payload?.reduce((acc, current) => {
        return {
          ...acc,
          [current[0]]: Number(current[1]),
        };
      }, {} as Balances);
      state.tokenBalances = parsedBalances;
    },
    setAllPairsState: (state, action: PayloadAction<FeatureState>) => {
      state.allPairsState = action.payload;
    },
    setAllPairs: (state, action: PayloadAction<PairList>) => {
      state.allPairs = action.payload;
    },
    setUserLPBalancesState: (state, action: PayloadAction<FeatureState>) => {
      state.userLPBalancesState = action.payload;
    },
    setUserLPBalances: (state, action: PayloadAction<PairBalances>) => {
      state.userLPBalances = action.payload;
    },
  },
});

export const swapCanisterActions = swapCanisterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapCanisterState = (state: RootState) => state.swap;

export default swapCanisterSlice.reducer;
