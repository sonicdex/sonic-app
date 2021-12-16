import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { SwapIDL } from '@/did';
import { Balances, PairList } from '@/models';

interface SwapState {
  supportedTokenListState: FeatureState;
  balancesState: FeatureState;
  allPairsState: FeatureState;
  userLPBalancesState: FeatureState;

  supportedTokenList?: SwapIDL.TokenInfoExt[];
  sonicBalances?: Balances;
  tokenBalances?: Balances;
  allPairs?: PairList;
  userLPBalances?: Balances;
}

const initialState: SwapState = {
  supportedTokenListState: 'loading' as FeatureState,
  balancesState: 'loading' as FeatureState,
  allPairsState: 'loading' as FeatureState,
  userLPBalancesState: 'loading' as FeatureState,

  supportedTokenList: undefined,
  sonicBalances: undefined,
  tokenBalances: undefined,
  allPairs: undefined,
  userLPBalances: undefined,
};

export const swapSlice = createSlice({
  name: 'swap',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
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
      action: PayloadAction<SwapIDL.TokenInfoExt[]>
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
    setUserLPBalances: (state, action: PayloadAction<Balances>) => {
      state.userLPBalances = action.payload;
    },
  },
});

export const swapActions = swapSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSwapState = (state: RootState) => state.swap;

export default swapSlice.reducer;
