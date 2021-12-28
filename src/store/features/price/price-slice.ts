import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState, RootState } from '@/store';

export interface PriceState {
  price?: string;
  state: FeatureState;
}

const initialState: PriceState = {
  price: undefined,
  state: 'idle' as FeatureState,
};

export const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    setPrice: (state, action: PayloadAction<string>) => {
      state.price = action.payload;
    },
  },
});

export const priceActions = priceSlice.actions;

export const selectPriceState = (state: RootState) => state.price;

export default priceSlice.reducer;
