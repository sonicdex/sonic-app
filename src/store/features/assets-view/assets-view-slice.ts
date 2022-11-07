import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { FeatureState } from '@/store';
import { getFromStorage, LocalStorageKey, saveToStorage } from '@/utils';

interface AssetsViewState {
  isBannerOpened: boolean;
  state: FeatureState;
}

const initialState: AssetsViewState = {
  isBannerOpened: !getFromStorage(LocalStorageKey.AssetsBannerDisabled),
  state: FeatureState?.Idle,
};

export const assetsViewSlice = createSlice({
  name: 'assets',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsBannerOpened: (state, action: PayloadAction<boolean>) => {
      saveToStorage(LocalStorageKey.AssetsBannerDisabled, !action.payload);
      state.isBannerOpened = action.payload;
    },
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
  },
});

export const assetsViewActions = assetsViewSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAssetsViewState = (state: RootState) => state.assetsView;

export default assetsViewSlice.reducer;
