import { selectModalsState } from '@/store';

import { useAppSelector } from '@/store';

export const useModalsStore = () => useAppSelector(selectModalsState);
