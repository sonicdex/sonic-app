import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { KeepSync, keepSyncActions } from './keep-sync-slice';

export type KeepSyncCallbackParams = {
  interval?: number;
  isRefreshing?: boolean;
};

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

  return ({
    interval: _interval = interval,
    isRefreshing = true,
  }: KeepSyncCallbackParams = {}) => {
    runner(isRefreshing);
    dispatch(keepSyncActions.trigger({ key, interval: _interval }));
  };
};
