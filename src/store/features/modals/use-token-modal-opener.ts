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
    dispatch(modalsSliceActions.clearTokenSelectData());
    dispatch(
      modalsSliceActions.setTokenSelectData({
        tokens: stringify(metadata),
        onSelect,
        selectedTokenIds,
      })
    );
    dispatch(modalsSliceActions.openTokenSelectModal());
  };

  return openSelectTokenModal;
};
