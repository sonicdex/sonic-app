import { serialize } from '@psychedelic/sonic-js';

import { AppTokenMetadata } from '@/models';
import { useAppDispatch } from '@/store';

import { modalsSliceActions } from '.';

type OpenSelectTokenModalOptions = {
  metadata?: AppTokenMetadata[];
  onSelect: (tokenId?: string) => void;
  selectedTokenIds?: string[];
};

export const useTokenModalOpener = () => {
  const dispatch = useAppDispatch();

  const openSelectTokenModal = ({
    metadata,
    onSelect,
    selectedTokenIds,
  }: OpenSelectTokenModalOptions) => {
    dispatch(
      modalsSliceActions.setTokenSelectModalData({
        tokens: serialize(metadata),
        onSelect,
        selectedTokenIds,
        // Add when we have a custom token selector
        allowAddToken: false,
      })
    );
    dispatch(modalsSliceActions.openTokenSelectModal());
  };

  return openSelectTokenModal;
};
