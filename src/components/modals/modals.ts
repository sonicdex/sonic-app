export enum Modals {
  SwapProgress,
  SwapFailed,
  Deposit,
  Withdraw,
  AddLiquidity,
  RemoveLiquidity,
  TokenSelect,
}

export type ModalComponentProps = {
  currentModalState?: string;
  currentModalData?: any;
  callbacks: (() => any)[];
  onClose: () => void;
};
