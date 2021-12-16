import { selectModalState } from '@/store';

import { useAppSelector } from '@/store';

export const useModalsStore = () => useAppSelector(selectModalState);
