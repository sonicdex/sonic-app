export const MODALS = {
  swapProgress: 'SWAP-PROGRESS',
  swapFailed: 'SWAP-FAILED',
};

export type ModalComponentProps = {
  currentModalState?: string;
  currentModalData?: any;
  callbacks: (() => any)[];
};
