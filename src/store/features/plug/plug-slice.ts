import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { Balance } from '@/models';

// Define a type for the slice state
interface PlugState {
  isConnected: boolean;
  principalId?: string;
  balance?: Balance;
  state: FeatureState;
}

// Define the initial state using that type
const initialState: PlugState = {
  isConnected: false,
  principalId: undefined,
  state: FeatureState?.Idle,
};

export const plugSlice = createSlice({
  name: 'plug',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setPrincipalId: (state, action: PayloadAction<string>) => {
      state.principalId = action.payload;
    },
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setBalance: (state, action: PayloadAction<any>) => {
      const parsedBalance = (action.payload as PlugTokenBalance[]).reduce(
        (acc, current) => {
          if (current.canisterId) {
            return {
              ...acc,
              [current.canisterId]: Number(current.amount),
            };
          }
          return acc;
        },
        {} as Balance
      );

      state.balance = parsedBalance;
    },
  },
});

export const plugActions = plugSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlugState = (state: RootState) => state.plug;

export default plugSlice.reducer;
