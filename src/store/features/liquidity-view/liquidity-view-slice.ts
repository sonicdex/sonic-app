import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FeatureState, RootState } from '@/store';
import { TokenMetadataList, TokenData, TokenDataKey } from '@/models';

interface LiquidityViewState {
  state: FeatureState;
  from: TokenData;
  to: TokenData;
  tokenList?: TokenMetadataList;
}

const initialState: LiquidityViewState = {
  state: FeatureState?.Idle,
  from: {
    token: undefined,
    value: '0.00',
  },
  to: {
    token: undefined,
    value: '0.00',
  },
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
      if (state.from.token?.id === state.to.token?.id && state.tokenList) {
        // Change 'to.token' if it's the same as the new 'from.token'
        const anotherTokenId = Object.keys(state.tokenList).find(
          (tokenId) => tokenId !== state.from.token?.id
        );
        state.to.token = anotherTokenId
          ? state.tokenList[anotherTokenId]
          : undefined;
      }
    },
    setTokenList: (state, action: PayloadAction<TokenMetadataList>) => {
      state.tokenList = action.payload;
      const tokens = Object.values(action.payload);
      state.from.token = tokens[0];
      state.from.value = '0.00';
      state.to.token = tokens[1];
      state.to.value = '0.00';
    },
  },
});

export const liquidityViewActions = liquidityViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLiquidityViewState = (state: RootState) =>
  state.liquidityView;

export default liquidityViewSlice.reducer;
