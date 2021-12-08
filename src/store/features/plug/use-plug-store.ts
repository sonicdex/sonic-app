import { useAppSelector, selectPlugState } from '@/store';

export const usePlugStore = () => useAppSelector(selectPlugState);
