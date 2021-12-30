import { TokenMetadata } from '@/models';
import { useAppDispatch } from '@/store';
import { stringify } from '@/utils/format';
import { modalsSliceActions } from '.';

type OpenSelectTokenModalOptions = {
  metadata?: TokenMetadata[];
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
    dispatch(modalsSliceActions.clearTokenSelectModalData());
    dispatch(
      modalsSliceActions.setTokenSelectModalData({
        tokens: stringify(metadata),
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
