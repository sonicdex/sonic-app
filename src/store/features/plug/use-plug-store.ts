import { selectPlugState,useAppSelector } from '@/store';

export const usePlugStore = () => useAppSelector(selectPlugState);
