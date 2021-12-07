import { selectSwapState } from '@/store';

import { useAppSelector } from '@/store';

export const useSwapStore = () => useAppSelector(selectSwapState);
