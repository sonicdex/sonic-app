import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';
import { Modals } from '@/modals';

export type ModalCallback = (arg0?: any) => any;

// Define a type for the slice state
interface ModalState {
  currentModal?: Modals;
  currentModalState?: string;
  currentModalData: any;
  callbacks?: ModalCallback[];
  onClose: () => void;
  state: FeatureState;
}

// Define the initial state using that type
const initialState: ModalState = {
  currentModal: undefined,
  currentModalState: '',
  currentModalData: {},
  onClose: () => {},
  state: FeatureState?.Idle,
};

export const modalSlice = createSlice({
  name: 'modal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCurrentModal: (state, action: PayloadAction<Modals>) => {
      state.currentModal = action.payload;
    },
    setModalCallbacks: (state, action: PayloadAction<ModalCallback[]>) => {
      state.callbacks = action.payload;
    },
    setCurrentModalState: (state, action: PayloadAction<string>) => {
      state.currentModalState = action.payload;
    },
    setOnClose: (state, action: PayloadAction<() => any>) => {
      state.onClose = action.payload;
    },
    setCurrentModalData: (state, action: PayloadAction<any>) => {
      state.currentModalData = action.payload;
    },
    clearModal: (state) => {
      state.currentModal = undefined;
      state.currentModalState = '';
      state.currentModalData = {};
      state.callbacks = [];
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
  setModalCallbacks,
  setOnClose,
  clearModal,
  setState: setModalState,
} = modalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModalState = (state: RootState) => state.modal;

export default modalSlice.reducer;
