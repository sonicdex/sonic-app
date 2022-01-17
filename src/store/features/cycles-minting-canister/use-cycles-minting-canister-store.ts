import { selectCyclesMintingCanisterState } from '@/store';
import { useAppSelector } from '@/store';

export const useCyclesMintingCanisterStore = () =>
  useAppSelector(selectCyclesMintingCanisterState);
