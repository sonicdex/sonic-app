import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Batch } from '@/integrations/transactions';
import type { RootState } from '@/store';

export type ModalsCallback = (...args: unknown[]) => any;

export enum RetryTransactionToken {
  XTC = 'XTC',
  WICP = 'WICP',
}

export type RetryTransactionModalData = {
  token?: RetryTransactionToken;
  blockHeight?: bigint;
};

export enum MintXTCModalDataStep {
  LedgerTransfer = 'ledgerTransfer',
  MintXTC = 'mintXTC',
  Approve = 'approve',
  Deposit = 'deposit',
}

export type MintXTCModalData<
  RetryCallback = ModalsCallback,
  CancelCallback = ModalsCallback
> = {
  step?: MintXTCModalDataStep | Batch.DefaultHookState;
  steps?: (MintXTCModalDataStep | Batch.DefaultHookState)[];
  callbacks?: [RetryCallback, CancelCallback];
};

export enum WrapModalDataStep {
  LedgerTransfer = 'ledgerTransfer',
  MintWIPC = 'mintWICP',
  Approve = 'approve',
  Deposit = 'deposit',
}

export type WrapModalData = {
  step?: WrapModalDataStep | Batch.DefaultHookState;
  steps?: (WrapModalDataStep | Batch.DefaultHookState)[];
  callbacks?: [ModalsCallback, ModalsCallback];
};

export enum UnwrapModalDataStep {
  Withdraw = 'withdraw',
  WithdrawWICP = 'withdrawWICP',
}
export type UnwrapModalData = {
  step?: UnwrapModalDataStep | Batch.DefaultHookState;
  steps?: (UnwrapModalDataStep | Batch.DefaultHookState)[];
  callbacks?: [ModalsCallback, ModalsCallback];
};

export enum SwapModalDataStep {
  Approve = 'approve',
  Deposit = 'deposit',
  Swap = 'swap',
  Withdraw = 'withdraw',
}
export type SwapModalData = {
  step?: SwapModalDataStep | Batch.DefaultHookState;
  steps?: (SwapModalDataStep | Batch.DefaultHookState)[];
  fromTokenSymbol?: string;
  toTokenSymbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback, ModalsCallback];
};

export enum DepositModalDataStep {
  Approve = 'approve',
  Deposit = 'deposit',
}
export type DepositModalData = {
  step?: DepositModalDataStep | Batch.DefaultHookState;
  steps?: (DepositModalDataStep | Batch.DefaultHookState)[];
  tokenSymbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback];
};

export enum WithdrawModalDataStep {
  Withdraw = 'withdraw',
}
export type WithdrawModalData = {
  step?: WithdrawModalDataStep | Batch.DefaultHookState;
  steps?: (WithdrawModalDataStep | Batch.DefaultHookState)[];
  tokenSymbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback];
};

export enum AddLiquidityModalDataStep {
  CreatePair = 'createPair',
  Approve0 = 'approve0',
  Deposit0 = 'deposit0',
  Approve1 = 'approve1',
  Deposit1 = 'deposit1',
  AddLiquidity = 'addLiquidity',
}
export type AddLiquidityModalData = {
  step?: AddLiquidityModalDataStep | Batch.DefaultHookState;
  steps?: (AddLiquidityModalDataStep | Batch.DefaultHookState)[];
  token0Symbol?: string;
  token1Symbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback];
};

export enum RemoveLiquidityModalDataStep {
  RemoveLiquidity = 'removeLiquidity',
  Withdraw0 = 'withdraw0',
  Withdraw1 = 'withdraw1',
}
export type RemoveLiquidityModalData = {
  step?: RemoveLiquidityModalDataStep | Batch.DefaultHookState;
  steps?: (RemoveLiquidityModalDataStep | Batch.DefaultHookState)[];
  token0Symbol?: string;
  token1Symbol?: string;
  callbacks?: [ModalsCallback, ModalsCallback];
};

export type AllowanceVerifyModalData = {
  tokenSymbol?: string | string[];
  callbacks?: [ModalsCallback, ModalsCallback];
};

export type TermsAndConditionsModalData = {
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
  retryTransactionModalOpened: boolean;
  retryTransactionModalData: RetryTransactionModalData;

  isMintXTCProgressModalOpened: boolean;
  isMintXTCFailModalOpened: boolean;
  mintXTCModalData: MintXTCModalData;
  mintXTCUncompleteBlockHeights?: bigint[];

  isWrapProgressModalOpened: boolean;
  isWrapFailModalOpened: boolean;
  wrapModalData: WrapModalData;
  wrapUncompleteBlockHeights?: bigint[];

  isUnwrapProgressModalOpened: boolean;
  isUnwrapFailModalOpened: boolean;
  unwrapModalData: UnwrapModalData;
  unwrapUncompleteBlockHeights?: bigint[];

  isSwapProgressModalOpened: boolean;
  isSwapFailModalOpened: boolean;
  swapModalData: SwapModalData;

  isDepositProgressModalOpened: boolean;
  isDepositFailModalOpened: boolean;
  depositModalData: DepositModalData;

  isWithdrawProgressModalOpened: boolean;
  isWithdrawFailModalOpened: boolean;
  withdrawModalData: WithdrawModalData;

  isAddLiquidityProgressModalOpened: boolean;
  isAddLiquidityFailModalOpened: boolean;
  addLiquidityModalData: AddLiquidityModalData;

  isRemoveLiquidityProgressModalOpened: boolean;
  isRemoveLiquidityFailModalOpened: boolean;
  removeLiquidityModalData: RemoveLiquidityModalData;

  isTokenSelectModalModalOpened: boolean;
  tokenSelectModalData: TokenSelectData;

  isRemoveLiquidityModalOpened: boolean;

  isAllowanceVerifyModalOpened: boolean;
  allowanceModalData: AllowanceVerifyModalData;

  isTermsAndConditionsModalOpened: boolean;
  termsAndConditionsModalData: TermsAndConditionsModalData;
}

const initialRetryTransactionModalData: RetryTransactionModalData = {
  token: RetryTransactionToken.WICP,
};

const initialMintXTCModalData: MintXTCModalData = {
  step: undefined,
};

const initialWrapModalData: WrapModalData = {
  step: undefined,
};

const initialUnwrapModalData: UnwrapModalData = {
  step: undefined,
};

const initialSwapModalData: SwapModalData = {
  step: undefined,
};

const initialDepositModalData: DepositModalData = {
  step: undefined,
};

const initialWithdrawModalData: WithdrawModalData = {
  step: undefined,
};

const initialAddLiquidityModalData: AddLiquidityModalData = {
  step: undefined,
};

const initialRemoveLiquidityModalData: RemoveLiquidityModalData = {
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
  retryTransactionModalOpened: false,
  retryTransactionModalData: initialRetryTransactionModalData,

  isMintXTCProgressModalOpened: false,
  isMintXTCFailModalOpened: false,
  mintXTCModalData: initialMintXTCModalData,
  mintXTCUncompleteBlockHeights: undefined,

  isWrapProgressModalOpened: false,
  isWrapFailModalOpened: false,
  wrapModalData: initialWrapModalData,
  wrapUncompleteBlockHeights: undefined,

  isUnwrapProgressModalOpened: false,
  isUnwrapFailModalOpened: false,
  unwrapModalData: initialUnwrapModalData,
  unwrapUncompleteBlockHeights: undefined,

  isSwapProgressModalOpened: false,
  isSwapFailModalOpened: false,
  swapModalData: initialSwapModalData,

  isDepositProgressModalOpened: false,
  isDepositFailModalOpened: false,
  depositModalData: initialDepositModalData,

  isWithdrawProgressModalOpened: false,
  isWithdrawFailModalOpened: false,
  withdrawModalData: initialWithdrawModalData,

  isAddLiquidityProgressModalOpened: false,
  isAddLiquidityFailModalOpened: false,
  addLiquidityModalData: initialAddLiquidityModalData,

  isRemoveLiquidityProgressModalOpened: false,
  isRemoveLiquidityFailModalOpened: false,
  removeLiquidityModalData: initialRemoveLiquidityModalData,

  isTokenSelectModalModalOpened: false,
  tokenSelectModalData: initialTokenSelectData,

  isRemoveLiquidityModalOpened: false,

  isAllowanceVerifyModalOpened: false,
  allowanceModalData: {},

  isTermsAndConditionsModalOpened: false,
  termsAndConditionsModalData: {},
};

export const modalsSlice = createSlice({
  name: 'modals',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openRetryTransactionModal: (
      state,
      action: PayloadAction<RetryTransactionModalData | undefined>
    ) => {
      state.retryTransactionModalOpened = true;
      state.retryTransactionModalData =
        action.payload ?? initialRetryTransactionModalData;
    },
    closeRetryTransactionModal: (state) => {
      state.retryTransactionModalOpened = false;
      state.retryTransactionModalData = initialRetryTransactionModalData;
    },

    openMintXTCProgressModal: (state) => {
      state.isMintXTCProgressModalOpened = true;
    },
    closeMintXTCProgressModal: (state) => {
      state.isMintXTCProgressModalOpened = false;
    },
    openMintXTCFailModal: (state) => {
      state.isMintXTCFailModalOpened = true;
    },
    closeMintXTCFailModal: (state) => {
      state.isMintXTCFailModalOpened = false;
    },
    clearMintXTCModalData: (state) => {
      state.mintXTCModalData = initialMintXTCModalData;
    },
    setMintXTCModalData: (state, action: PayloadAction<MintXTCModalData>) => {
      state.mintXTCModalData = {
        ...state.mintXTCModalData,
        ...action.payload,
      };
    },
    setMintXTCUncompleteBlockHeights: (
      state,
      action: PayloadAction<bigint[]>
    ) => {
      state.mintXTCUncompleteBlockHeights = action.payload;
    },

    openWrapProgressModal: (state) => {
      state.isWrapProgressModalOpened = true;
    },
    closeWrapProgressModal: (state) => {
      state.isWrapProgressModalOpened = false;
    },
    openWrapFailModal: (state) => {
      state.isWrapFailModalOpened = true;
    },
    closeWrapFailModal: (state) => {
      state.isWrapFailModalOpened = false;
    },
    clearWrapModalData: (state) => {
      state.wrapModalData = initialWrapModalData;
    },
    setWrapModalData: (state, action: PayloadAction<WrapModalData>) => {
      state.wrapModalData = {
        ...state.wrapModalData,
        ...action.payload,
      };
    },
    setWrapUncompleteBlockHeights: (state, action: PayloadAction<bigint[]>) => {
      state.wrapUncompleteBlockHeights = action.payload;
    },

    openUnwrapProgressModal: (state) => {
      state.isUnwrapProgressModalOpened = true;
    },
    closeUnwrapProgressModal: (state) => {
      state.isUnwrapProgressModalOpened = false;
    },
    openUnwrapFailModal: (state) => {
      state.isUnwrapFailModalOpened = true;
    },
    closeUnwrapFailModal: (state) => {
      state.isUnwrapFailModalOpened = false;
    },
    clearUnwrapModalData: (state) => {
      state.unwrapModalData = initialUnwrapModalData;
    },
    setUnwrapModalData: (state, action: PayloadAction<UnwrapModalData>) => {
      state.unwrapModalData = {
        ...state.unwrapModalData,
        ...action.payload,
      };
    },
    setUnwrapUncompleteBlockHeights: (
      state,
      action: PayloadAction<bigint[]>
    ) => {
      state.unwrapUncompleteBlockHeights = action.payload;
    },

    openSwapProgressModal: (state) => {
      state.isSwapProgressModalOpened = true;
    },
    closeSwapProgressModal: (state) => {
      state.isSwapProgressModalOpened = false;
    },
    openSwapFailModal: (state) => {
      state.isSwapFailModalOpened = true;
    },
    closeSwapFailModal: (state) => {
      state.isSwapFailModalOpened = false;
    },
    clearSwapModalData: (state) => {
      state.swapModalData = initialSwapModalData;
    },
    setSwapModalData: (state, action: PayloadAction<SwapModalData>) => {
      state.swapModalData = {
        ...state.swapModalData,
        ...action.payload,
      };
    },

    openDepositProgressModal: (state) => {
      state.isDepositProgressModalOpened = true;
    },
    closeDepositProgressModal: (state) => {
      state.isDepositProgressModalOpened = false;
    },
    openDepositFailModal: (state) => {
      state.isDepositFailModalOpened = true;
    },
    closeDepositFailModal: (state) => {
      state.isDepositFailModalOpened = false;
    },
    clearDepositModalData: (state) => {
      state.depositModalData = initialDepositModalData;
    },
    setDepositModalData: (state, action: PayloadAction<DepositModalData>) => {
      state.depositModalData = {
        ...state.depositModalData,
        ...action.payload,
      };
    },

    openWithdrawProgressModal: (state) => {
      state.isWithdrawProgressModalOpened = true;
    },
    closeWithdrawProgressModal: (state) => {
      state.isWithdrawProgressModalOpened = false;
    },
    openWithdrawFailModal: (state) => {
      state.isWithdrawFailModalOpened = true;
    },
    closeWithdrawFailModal: (state) => {
      state.isWithdrawFailModalOpened = false;
    },
    clearWithdrawModalData: (state) => {
      state.withdrawModalData = initialWithdrawModalData;
    },
    setWithdrawModalData: (state, action: PayloadAction<WithdrawModalData>) => {
      state.withdrawModalData = {
        ...state.withdrawModalData,
        ...action.payload,
      };
    },

    openAddLiquidityProgressModal: (state) => {
      state.isAddLiquidityProgressModalOpened = true;
    },
    closeAddLiquidityProgressModal: (state) => {
      state.isAddLiquidityProgressModalOpened = false;
    },
    openAddLiquidityFailModal: (state) => {
      state.isAddLiquidityFailModalOpened = true;
    },
    closeAddLiquidityFailModal: (state) => {
      state.isAddLiquidityFailModalOpened = false;
    },
    clearAddLiquidityModalData: (state) => {
      state.addLiquidityModalData = initialAddLiquidityModalData;
    },
    setAddLiquidityModalData: (
      state,
      action: PayloadAction<AddLiquidityModalData>
    ) => {
      state.addLiquidityModalData = {
        ...state.addLiquidityModalData,
        ...action.payload,
      };
    },

    openRemoveLiquidityProgressModal: (state) => {
      state.isRemoveLiquidityProgressModalOpened = true;
    },
    closeRemoveLiquidityProgressModal: (state) => {
      state.isRemoveLiquidityProgressModalOpened = false;
    },
    openRemoveLiquidityFailModal: (state) => {
      state.isRemoveLiquidityFailModalOpened = true;
    },
    closeRemoveLiquidityFailModal: (state) => {
      state.isRemoveLiquidityFailModalOpened = false;
    },
    clearRemoveLiquidityModalData: (state) => {
      state.removeLiquidityModalData = initialRemoveLiquidityModalData;
    },
    setRemoveLiquidityModalData: (
      state,
      action: PayloadAction<RemoveLiquidityModalData>
    ) => {
      state.removeLiquidityModalData = {
        ...state.removeLiquidityModalData,
        ...action.payload,
      };
    },

    openTokenSelectModal: (state) => {
      state.isTokenSelectModalModalOpened = true;
    },
    closeTokenSelectModal: (state) => {
      state.isTokenSelectModalModalOpened = false;
    },
    clearTokenSelectModalData: (state) => {
      state.tokenSelectModalData = initialTokenSelectData;
    },
    setTokenSelectModalData: (
      state,
      action: PayloadAction<TokenSelectData>
    ) => {
      state.tokenSelectModalData = action.payload;
    },

    openRemoveLiquidityModal: (state) => {
      state.isRemoveLiquidityModalOpened = true;
    },
    closeRemoveLiquidityModal: (state) => {
      state.isRemoveLiquidityModalOpened = false;
    },

    openAllowanceVerifyModal: (state) => {
      state.isAllowanceVerifyModalOpened = true;
    },
    closeAllowanceVerifyModal: (state) => {
      state.isAllowanceVerifyModalOpened = false;
    },
    setAllowanceVerifyModalData: (
      state,
      action: PayloadAction<AllowanceVerifyModalData>
    ) => {
      state.allowanceModalData = action.payload;
    },

    openTermsAndConditionsModal: (state) => {
      state.isTermsAndConditionsModalOpened = true;
    },
    closeTermsAndConditionsModal: (state) => {
      state.isTermsAndConditionsModalOpened = false;
    },
    setTermsAndConditionsModalData: (
      state,
      action: PayloadAction<TermsAndConditionsModalData>
    ) => {
      state.termsAndConditionsModalData = action.payload;
    },
  },
});

export const modalsSliceActions = modalsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectModalsState = (state: RootState) => state.modals;

export default modalsSlice.reducer;
