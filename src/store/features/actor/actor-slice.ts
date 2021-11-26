import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { LedgerIDL, SwapIDL, SwapStorageIDL, TokenIDL } from '@/did';
import { ENV } from '@/config';

export interface Actors {
  ledger?: LedgerIDL.Factory;
  swap?: SwapIDL.Factory;
  swapStorage?: SwapStorageIDL.Factory;
}

export interface TokenActors {
  [canisterId: string]: TokenIDL.Factory;
}

interface ActorState {
  actors: Actors;
  tokenActors: TokenActors;
  state: FeatureState;
}

const initialState: ActorState = {
  actors: {
    ledger: undefined,
    swap: undefined,
    swapStorage: undefined,
  },
  tokenActors: {
    [ENV.canisterIds.WICP]: undefined,
    [ENV.canisterIds.XTC]: undefined,
  },
  state: FeatureState?.Idle,
};

export const actorSlice = createSlice({
  name: 'actor',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setActors: (state, action: PayloadAction<Actors>) => {
      state.actors = { ...state.actors, ...action.payload };
    },
    setTokenActors: (state, action: PayloadAction<TokenActors>) => {
      state.tokenActors = { ...state.tokenActors, ...action.payload };
    },
  },
});

export const {
  setState: setActorState,
  setActors,
  setTokenActors,
} = actorSlice.actions;

export const selectActorState = (state: RootState) => state.actor;

export default actorSlice.reducer;
