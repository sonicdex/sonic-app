import { selectTransferViewState } from '@/store';
import { useAppSelector } from '@/store';

export const useTransferViewStore = () => { return  useAppSelector(selectTransferViewState); }
