import { selectLiquidityViewState } from '@/store';

import { useAppSelector } from '@/store';

export const useLiquidityViewStore = () =>
  useAppSelector(selectLiquidityViewState);
