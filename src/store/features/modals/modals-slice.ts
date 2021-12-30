import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureState } from '@/store';
import type { RootState } from '@/store';

export type ModalsCallback = (arg0?: any) => any;

export type WrapModalDataStep = 'ledgerTransfer' | 'mintWICP' | 'withdraw';
export type WrapModalData = {
  step?: WrapModalDataStep;
  steps?: WrapModalDataStep[];
  callbacks?: [ModalsCallback, ModalsCallback];
};

export type UnwrapModalDataStep = 'withdrawWICP';
export type UnwrapModalData = {
  step?: UnwrapModalDataStep;
  steps?: UnwrapModalDataStep[];
  callbacks?: [ModalsCallback, ModalsCallback];
};

export type SwapModalDataStep = 'approve' | 'deposit' | 'swap' | 'withdraw';
export type SwapModalData = {
  step?: SwapModalDataStep;
  steps?: SwapModalDataStep[];
  fromTokenSymbol?: string;
  toTokenSymbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback, ModalsCallback];
};

export type DepositModalDataStep = 'approve' | 'deposit';
export type DepositModalData = {
  step?: DepositModalDataStep;
  steps?: DepositModalDataStep[];
  tokenSymbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback];
};

export type WithdrawModalDataStep = 'withdraw';
export type WithdrawModalData = {
  step?: WithdrawModalDataStep;
  tokenSymbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback];
};

export type AddLiquidityModalDataStep =
  | 'createPair'
  | 'approve0'
  | 'deposit0'
  | 'approve1'
  | 'deposit1'
  | 'addLiquidity';
export type AddLiquidityModalData = {
  step?: AddLiquidityModalDataStep;
  steps?: AddLiquidityModalDataStep[];
  token0Symbol?: string;
  token1Symbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback];
};

export type RemoveLiquidityModalDataStep =
  | 'removeLiquidity'
  | 'withdraw0'
  | 'withdraw1';
export type RemoveLiquidityModalData = {
  step?: RemoveLiquidityModalDataStep;
  steps?: RemoveLiquidityModalDataStep[];
  token0Symbol?: string;
  token1Symbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback];
};

type TokenSelectData = {
  tokens: string;
  selectedTokenIds?: string[];
  isLoading?: boolean;
  allowAddToken?: boolean;
  onSelect: (tokenId?: string) => void;
};

// Define a type for the slice state
interface ModalsState {
  isWrapProgressOpened: boolean;
  isWrapFailOpened: boolean;
  wrapData: WrapModalData;

  isUnwrapProgressOpened: boolean;
  isUnwrapFailOpened: boolean;
  unwrapData: UnwrapModalData;

  isSwapProgressOpened: boolean;
  isSwapFailOpened: boolean;
  swapData: SwapModalData;

  isDepositProgressOpened: boolean;
  isDepositFailOpened: boolean;
  depositData: DepositModalData;

  isWithdrawProgressOpened: boolean;
  isWithdrawFailOpened: boolean;
  withdrawData: WithdrawModalData;

  isAddLiquidityProgressOpened: boolean;
  isAddLiquidityFailOpened: boolean;
  addLiquidityData: AddLiquidityModalData;

  isRemoveLiquidityProgressOpened: boolean;
  isRemoveLiquidityFailOpened: boolean;
  removeLiquidityData: RemoveLiquidityModalData;

  isTokenSelectOpened: boolean;
  tokenSelectData: TokenSelectData;

  isLiquidityRemoveOpened: boolean;

  state: FeatureState;
}

const initialWrapData: WrapModalData = {
  step: undefined,
};

const initialUnwrapData: UnwrapModalData = {
  step: undefined,
};

const initialSwapData: SwapModalData = {
  step: undefined,
};

const initialDepositData: DepositModalData = {
  step: undefined,
};

const initialWithdrawData: WithdrawModalData = {
  step: undefined,
};

const initialAddLiquidityData: AddLiquidityModalData = {
  step: undefined,
};

const initialRemoveLiquidityData: RemoveLiquidityModalData = {
  step: undefined,
};

const initialTokenSelectData: TokenSelectData = {
  onSelect: () => null,
  tokens: '[]',
  selectedTokenIds: [],
  isLoading: false,
  allowAddToken: true,
};

// Define the initial state using that type
const initialState: ModalsState = {
  isWrapProgressOpened: false,
  isWrapFailOpened: false,
  wrapData: initialWrapData,

  isUnwrapProgressOpened: false,
  isUnwrapFailOpened: false,
  unwrapData: initialUnwrapData,

  isSwapProgressOpened: false,
  isSwapFailOpened: false,
  swapData: initialSwapData,

  isDepositProgressOpened: false,
  isDepositFailOpened: false,
  depositData: initialDepositData,

  isWithdrawProgressOpened: false,
  isWithdrawFailOpened: false,
  withdrawData: initialWithdrawData,

  isAddLiquidityProgressOpened: false,
  isAddLiquidityFailOpened: false,
  addLiquidityData: initialAddLiquidityData,

  isRemoveLiquidityProgressOpened: false,
  isRemoveLiquidityFailOpened: false,
  removeLiquidityData: initialRemoveLiquidityData,

  isTokenSelectOpened: false,
  tokenSelectData: initialTokenSelectData,

  isLiquidityRemoveOpened: false,

  state: FeatureState?.Idle,
};

export const modalsSlice = createSlice({
  name: 'modals',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openWrapProgressModal: (state) => {
      state.isWrapProgressOpened = true;
    },
    closeWrapProgressModal: (state) => {
      state.isWrapProgressOpened = false;
    },
    openWrapFailModal: (state) => {
      state.isWrapFailOpened = true;
    },
    closeWrapFailModal: (state) => {
      state.isWrapFailOpened = false;
    },
    setWrapData: (state, action: PayloadAction<WrapModalData>) => {
      state.wrapData = {
        ...state.wrapData,
        ...action.payload,
      };
    },

    openUnwrapProgressModal: (state) => {
      state.isUnwrapProgressOpened = true;
    },
    closeUnwrapProgressModal: (state) => {
      state.isUnwrapProgressOpened = false;
    },
    openUnwrapFailModal: (state) => {
      state.isUnwrapFailOpened = true;
    },
    closeUnwrapFailModal: (state) => {
      state.isUnwrapFailOpened = false;
    },
    setUnwrapData: (state, action: PayloadAction<UnwrapModalData>) => {
      state.unwrapData = {
        ...state.unwrapData,
        ...action.payload,
      };
    },

    openRemoveLiquidityModal: (state) => {
      state.isLiquidityRemoveOpened = true;
    },
    closeRemoveLiquidityModal: (state) => {
      state.isLiquidityRemoveOpened = false;
    },

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
    clearSwapData: (state) => {
      state.swapData = initialSwapData;
    },
    setSwapData: (state, action: PayloadAction<SwapModalData>) => {
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
    clearDepositData: (state) => {
      state.depositData = initialDepositData;
    },
    setDepositData: (state, action: PayloadAction<DepositModalData>) => {
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
    clearWithdrawData: (state) => {
      state.withdrawData = initialWithdrawData;
    },
    setWithdrawData: (state, action: PayloadAction<WithdrawModalData>) => {
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
    clearAddLiquidityData: (state) => {
      state.addLiquidityData = initialAddLiquidityData;
    },
    setAddLiquidityData: (
      state,
      action: PayloadAction<AddLiquidityModalData>
    ) => {
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
    clearRemoveLiquidityData: (state) => {
      state.removeLiquidityData = initialRemoveLiquidityData;
    },
    setRemoveLiquidityData: (
      state,
      action: PayloadAction<RemoveLiquidityModalData>
    ) => {
      state.removeLiquidityData = {
        ...state.removeLiquidityData,
        ...action.payload,
      };
    },

    openTokenSelectModal: (state) => {
      state.isTokenSelectOpened = true;
    },
    closeTokenSelectModal: (state) => {
      state.isTokenSelectOpened = false;
    },
    clearTokenSelectData: (state) => {
      state.tokenSelectData = initialTokenSelectData;
    },
    setTokenSelectData: (state, action: PayloadAction<TokenSelectData>) => {
      state.tokenSelectData = action.payload;
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
