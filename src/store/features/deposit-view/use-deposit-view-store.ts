import { selectDepositViewState } from '@/store';
import { useAppSelector } from '@/store';

export const useDepositViewStore = () => { return  useAppSelector(selectDepositViewState); }
