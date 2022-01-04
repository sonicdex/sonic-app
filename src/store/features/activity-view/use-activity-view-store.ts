import { selectActivityViewState } from '@/store';
import { useAppSelector } from '@/store';

export const useActivityViewStore = () =>
  useAppSelector(selectActivityViewState);
