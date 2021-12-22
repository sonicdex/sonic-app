import { useCallback, useEffect, useMemo, useState } from 'react';

export const KEEP_SYNC_DEFAULT_INTERVAL = 15 * 1000;

export type KeepSyncParams = {
  interval?: number;
};

export const useKeepSync = (
  runner: () => any,
  { interval = KEEP_SYNC_DEFAULT_INTERVAL }: KeepSyncParams = {}
) => {
  const [counter, setCounter] = useState(0);

  const timeout = useMemo(() => {
    return setTimeout(runner, interval);
  }, [counter]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, [timeout]);

  const callback = useCallback(
    () => setCounter(counter + 1),
    [counter, timeout]
  );

  return callback;
};
