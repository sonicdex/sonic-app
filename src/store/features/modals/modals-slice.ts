import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';

export type ModalsCallback = (arg0?: any) => any;

type SwapData = {};
type DepositData = {};
type WithdrawData = {};
type AddLiquidityData = {};
type RemoveLiquidityData = {};

// Define a type for the slice state
interface ModalsState {
  isSwapProgressOpened: boolean;
  isSwapFailOpened: boolean;
  swapData: SwapData;

  isDepositProgressOpened: boolean;
  isDepositFailOpened: boolean;
  depositData: DepositData;

  isWithdrawProgressOpened: boolean;
  isWithdrawFailOpened: boolean;
  withdrawData: WithdrawData;

  isAddLiquidityProgressOpened: boolean;
  isAddLiquidityFailOpened: boolean;
  addLiquidityData: AddLiquidityData;

  isRemoveLiquidityProgressOpened: boolean;
  isRemoveLiquidityFailOpened: boolean;
  removeLiquidityData: RemoveLiquidityData;

  state: FeatureState;
}

// Define the initial state using that type
const initialState: ModalsState = {
  isSwapProgressOpened: false,
  isSwapFailOpened: false,
  swapData: {},

  isDepositProgressOpened: false,
  isDepositFailOpened: false,
  depositData: {},

  isWithdrawProgressOpened: false,
  isWithdrawFailOpened: false,
  withdrawData: {},

  isAddLiquidityProgressOpened: false,
  isAddLiquidityFailOpened: false,
  addLiquidityData: {},

  isRemoveLiquidityProgressOpened: false,
  isRemoveLiquidityFailOpened: false,
  removeLiquidityData: {},
  state: FeatureState?.Idle,
};

export const modalsSlice = createSlice({
  name: 'modals',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openSwapProgressModal: (state) => {
      state.isSwapProgressOpened = true;
    },
    closeSwapProgressModal: (state) => {
      state.isSwapProgressOpened = false;
    },
    openSwapFailModal: (state) => {
      state.isSwapFailOpened = true;
    },
    closeSwapFailModal: (state) => {
      state.isSwapFailOpened = false;
    },
    setSwapData: (state, action: PayloadAction<{}>) => {
      state.swapData = {
        ...state.swapData,
        ...action.payload,
      };
    },

    openDepositProgressModal: (state) => {
      state.isDepositProgressOpened = true;
    },
    closeDepositProgressModal: (state) => {
      state.isDepositProgressOpened = false;
    },
    openDepositFailModal: (state) => {
      state.isDepositFailOpened = true;
    },
    closeDepositFailModal: (state) => {
      state.isDepositFailOpened = false;
    },
    setDepositData: (state, action: PayloadAction<{}>) => {
      state.depositData = {
        ...state.depositData,
        ...action.payload,
      };
    },

    openWithdrawProgressModal: (state) => {
      state.isWithdrawProgressOpened = true;
    },
    closeWithdrawProgressModal: (state) => {
      state.isWithdrawProgressOpened = false;
    },
    openWithdrawFailModal: (state) => {
      state.isWithdrawFailOpened = true;
    },
    closeWithdrawFailModal: (state) => {
      state.isWithdrawFailOpened = false;
    },
    setWithdrawData: (state, action: PayloadAction<{}>) => {
      state.withdrawData = {
        ...state.withdrawData,
        ...action.payload,
      };
    },

    openAddLiquidityProgressModal: (state) => {
      state.isAddLiquidityProgressOpened = true;
    },
    closeAddLiquidityProgressModal: (state) => {
      state.isAddLiquidityProgressOpened = false;
    },
    openAddLiquidityFailModal: (state) => {
      state.isAddLiquidityFailOpened = true;
    },
    closeAddLiquidityFailModal: (state) => {
      state.isAddLiquidityFailOpened = false;
    },
    setAddLiquidityData: (state, action: PayloadAction<{}>) => {
      state.addLiquidityData = {
        ...state.addLiquidityData,
        ...action.payload,
      };
    },

    openRemoveLiquidityProgressModal: (state) => {
      state.isRemoveLiquidityProgressOpened = true;
    },
    closeRemoveLiquidityProgressModal: (state) => {
      state.isRemoveLiquidityProgressOpened = false;
    },
    openRemoveLiquidityFailModal: (state) => {
      state.isRemoveLiquidityFailOpened = true;
    },
    closeRemoveLiquidityFailModal: (state) => {
      state.isRemoveLiquidityFailOpened = false;
    },
    setRemoveLiquidityData: (state, action: PayloadAction<{}>) => {
      state.removeLiquidityData = {
        ...state.removeLiquidityData,
        ...action.payload,
      };
    },

    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
  },
});

export const modalsSliceActions = modalsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModalsState = (state: RootState) => state.modals;

export default modalsSlice.reducer;
