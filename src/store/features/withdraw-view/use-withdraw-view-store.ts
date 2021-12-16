import { selectAssetsViewState } from '@/store';

import { useAppSelector } from '@/store';

export const useAssetsViewStore = () => useAppSelector(selectAssetsViewState);
