import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';

// Define a type for the slice state
interface ModalState {
  currentModal: string;
  currentModalState?: string;
  currentModalData: any;
  state: FeatureState;
}

// Define the initial state using that type
const initialState: ModalState = {
  currentModal: undefined,
  currentModalState: undefined,
  currentModalData: {},
  state: FeatureState?.Idle,
};

export const modalSlice = createSlice({
  name: 'modal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCurrentModal: (state, action: PayloadAction<string>) => {
      state.currentModal = action.payload;
    },
    setCurrentModalState: (state, action: PayloadAction<string>) => {
      state.currentModalState = action.payload;
    },
    setCurrentModalData: (state, action: PayloadAction<any>) => {
      state.currentModalData = action.payload;
    },
    clearModal: (state) => {
      state.currentModal = undefined;
      state.currentModalState = undefined;
      state.currentModalData = {};
    },
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
  },
});

export const {
  setCurrentModal,
  setCurrentModalState,
  setCurrentModalData,
  clearModal,
  setState: setModalState,
} = modalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModalState = (state: RootState) => state.modal;

export default modalSlice.reducer;
