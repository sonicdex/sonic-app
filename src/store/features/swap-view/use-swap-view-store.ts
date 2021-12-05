import { selectSwapViewState } from '@/store';

import { useAppSelector } from '@/store';

export const useSwapViewStore = () => useAppSelector(selectSwapViewState);
