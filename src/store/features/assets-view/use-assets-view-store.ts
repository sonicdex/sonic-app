import { selectWithdrawViewState } from '@/store';
import { useAppSelector } from '@/store';

export const useWithdrawViewStore = () =>
  useAppSelector(selectWithdrawViewState);
