import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FeatureState, RootState } from '@/store';
import { TokenMetadataList, TokenData, TokenDataKey } from '@/models';

interface LiquidityViewState {
  state: FeatureState;
  token0: TokenData;
  token1: TokenData;
  tokenList?: TokenMetadataList;
  slippage: string;
}

const initialState: LiquidityViewState = {
  state: FeatureState?.Idle,
  token0: {
    token: undefined,
    value: '0.00',
  },
  token1: {
    token: undefined,
    value: '0.00',
  },
  slippage: '0.10',
  tokenList: undefined,
};

export const liquidityViewSlice = createSlice({
  name: 'liquidity',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setValue: (
      state,
      action: PayloadAction<{ data: TokenDataKey; value: string }>
    ) => {
      state[action.payload.data].value = action.payload.value;
    },
    setToken: (
      state,
      action: PayloadAction<{ data: TokenDataKey; tokenId: string | undefined }>
    ) => {
      state[action.payload.data].token =
        action.payload.tokenId && state.tokenList
          ? state.tokenList[action.payload.tokenId]
          : undefined;
      if (
        state.token0.token?.id === state.token1.token?.id &&
        state.tokenList
      ) {
        // Change 'to.token' if it's the same as the new 'from.token'
        const anotherTokenId = Object.keys(state.tokenList).find(
          (tokenId) => tokenId !== state.token0.token?.id
        );
        state.token1.token = anotherTokenId
          ? state.tokenList[anotherTokenId]
          : undefined;
      }
    },
    setSlippage: (state, action: PayloadAction<string>) => {
      state.slippage = action.payload;
    },
    setTokenList: (state, action: PayloadAction<TokenMetadataList>) => {
      state.tokenList = action.payload;
      const tokens = Object.values(action.payload);
      state.token0.token = tokens[0];
      state.token0.value = '0.00';
      state.token1.token = tokens[1];
      state.token1.value = '0.00';
    },
  },
});

export const liquidityViewActions = liquidityViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLiquidityViewState = (state: RootState) =>
  state.liquidityView;

export default liquidityViewSlice.reducer;
