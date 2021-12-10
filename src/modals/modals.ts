export const MODALS = {
  swapProgress: 'SWAP-PROGRESS',
  swapFailed: 'SWAP-FAILED',
  tokenSelect: 'TOKEN-SELECT',
};

export type ModalComponentProps = {
  currentModalState?: string;
  currentModalData?: any;
  callbacks: (() => any)[];
  onClose: () => any;
};
