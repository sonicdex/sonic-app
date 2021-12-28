import { useAppSelector } from '@/store';

import { selectPriceState } from '.';

export const usePriceStore = () => useAppSelector(selectPriceState);
