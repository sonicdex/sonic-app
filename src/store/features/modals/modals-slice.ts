import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Batch } from '@/integrations/transactions';
import type { RootState } from '@/store';

export type ModalsCallback = (...args: unknown[]) => any;

export enum MintTokenSymbol {
  XTC = 'XTC',
  WICP = 'WICP',
}

export enum MintModalDataStep {
  LedgerTransfer = 'ledgerTransfer',
  Mint = 'mint',
  Approve = 'approve',
  Deposit = 'deposit',
}

export type MintModalData<
  RetryCallback = ModalsCallback,
  CancelCallback = ModalsCallback
> = {
  step?: MintModalDataStep | Batch.DefaultHookState;
  steps?: (MintModalDataStep | Batch.DefaultHookState)[];
  callbacks?: [RetryCallback, CancelCallback];
};

export enum WithdrawWICPModalDataStep {
  Withdraw = 'withdraw',
  WithdrawWICP = 'withdrawWICP',
}
export type WithdrawWICPModalData = {
  step?: WithdrawWICPModalDataStep | Batch.DefaultHookState;
  steps?: (WithdrawWICPModalDataStep | Batch.DefaultHookState)[];
  callbacks?: [ModalsCallback, ModalsCallback];
};

export enum SwapModalDataStep {
  Getacnt= 'getacnt',
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
  Getacnt = 'getacnt'

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
  mintXTCUncompleteBlockHeights?: string[];
  mintWICPUncompleteBlockHeights?: string[];

  mintManualModalOpened: boolean;
  mintManualModalErrorMessage: string;
  mintManualBlockHeight: string;
  mintManualTokenSymbol: MintTokenSymbol;

  isMintXTCProgressModalOpened: boolean;
  isMintXTCFailModalOpened: boolean;
  mintXTCModalData: MintModalData;

  isMintWICPProgressModalOpened: boolean;
  isMintWICPFailModalOpened: boolean;
  mintWICPModalData: MintModalData;

  isWithdrawWICPProgressModalOpened: boolean;
  isWithdrawWICPFailModalOpened: boolean;
  withdrawWICPModalData: WithdrawWICPModalData;

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

const initialMintXTCModalData: MintModalData = {
  step: undefined,
};

const initialMintWICPModalData: MintModalData = {
  step: undefined,
};

const initialWithdrawWICPModalData: WithdrawWICPModalData = {
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
  mintManualModalOpened: false,
  mintManualModalErrorMessage: '',
  mintManualTokenSymbol: MintTokenSymbol.WICP,
  mintManualBlockHeight: '',

  isMintXTCProgressModalOpened: false,
  isMintXTCFailModalOpened: false,
  mintXTCModalData: initialMintXTCModalData,
  mintXTCUncompleteBlockHeights: undefined,

  isMintWICPProgressModalOpened: false,
  isMintWICPFailModalOpened: false,
  mintWICPModalData: initialMintWICPModalData,
  mintWICPUncompleteBlockHeights: undefined,

  isWithdrawWICPProgressModalOpened: false,
  isWithdrawWICPFailModalOpened: false,
  withdrawWICPModalData: initialWithdrawWICPModalData,

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
    setMintManualTokenSymbol: (
      state,
      action: PayloadAction<MintTokenSymbol>
    ) => {
      state.mintManualTokenSymbol = action.payload;
    },
    setMintManualBlockHeight: (state, action: PayloadAction<string>) => {
      state.mintManualBlockHeight = action.payload;
    },
    setMintManualModalErrorMessage: (state, action: PayloadAction<string>) => {
      state.mintManualModalErrorMessage = action.payload;
    },
    openMintManualModal: (state) => {
      state.mintManualModalOpened = true;
    },
    closeMintManualModal: (state) => {
      state.mintManualModalOpened = false;
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
    setMintXTCModalData: (state, action: PayloadAction<MintModalData>) => {
      state.mintXTCModalData = {
        ...state.mintXTCModalData,
        ...action.payload,
      };
    },
    setMintXTCUncompleteBlockHeights: (
      state,
      action: PayloadAction<string[]>
    ) => {
      state.mintXTCUncompleteBlockHeights = action.payload;
    },
    addMintXTCUncompleteBlockHeight: (state, action: PayloadAction<string>) => {
      if (state.mintXTCUncompleteBlockHeights === undefined) {
        state.mintXTCUncompleteBlockHeights = [];
      }
      state.mintXTCUncompleteBlockHeights.push(action.payload);
    },

    openMintWICPProgressModal: (state) => {
      state.isMintWICPProgressModalOpened = true;
    },
    closeMintWICPProgressModal: (state) => {
      state.isMintWICPProgressModalOpened = false;
    },
    openMintWICPFailModal: (state) => {
      state.isMintWICPFailModalOpened = true;
    },
    closeMintWICPFailModal: (state) => {
      state.isMintWICPFailModalOpened = false;
    },
    clearMintWICPModalData: (state) => {
      state.mintWICPModalData = initialMintWICPModalData;
    },
    setMintWICPModalData: (state, action: PayloadAction<MintModalData>) => {
      state.mintWICPModalData = {
        ...state.mintWICPModalData,
        ...action.payload,
      };
    },
    setMintWICPUncompleteBlockHeights: (
      state,
      action: PayloadAction<string[]>
    ) => {
      state.mintWICPUncompleteBlockHeights = action.payload;
    },
    addMintWICPUncompleteBlockHeight: (
      state,
      action: PayloadAction<string>
    ) => {
      if (state.mintWICPUncompleteBlockHeights === undefined) {
        state.mintWICPUncompleteBlockHeights = [];
      }
      state.mintWICPUncompleteBlockHeights.push(action.payload);
    },

    openWithdrawWICPProgressModal: (state) => {
      state.isWithdrawWICPProgressModalOpened = true;
    },
    closeWithdrawWICPProgressModal: (state) => {
      state.isWithdrawWICPProgressModalOpened = false;
    },
    openWithdrawWICPFailModal: (state) => {
      state.isWithdrawWICPFailModalOpened = true;
    },
    closeWithdrawWICPFailModal: (state) => {
      state.isWithdrawWICPFailModalOpened = false;
    },
    clearWithdrawWICPModalData: (state) => {
      state.withdrawWICPModalData = initialWithdrawWICPModalData;
    },
    setWithdrawWICPModalData: (
      state,
      action: PayloadAction<WithdrawWICPModalData>
    ) => {
      state.withdrawWICPModalData = {
        ...state.withdrawWICPModalData,
        ...action.payload,
      };
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
