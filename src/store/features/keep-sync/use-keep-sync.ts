import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { KeepSync, keepSyncActions } from './keep-sync-slice';

export type KeepSyncParams = {
  interval?: number;
};

export const useKeepSync = (
  key: string,
  runner: KeepSync['callback'],
  { interval }: KeepSyncParams = {}
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(keepSyncActions.setCallback({ key, callback: runner }));
  }, [runner]);

  return (_interval = interval) => {
    runner();
    dispatch(keepSyncActions.trigger({ key, interval: _interval }));
  };
};
