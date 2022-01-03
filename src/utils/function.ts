import { ENV } from '@/config';

let timer: NodeJS.Timer | null = null;

export const debounce = (
  fn: (...args: unknown[]) => unknown,
  awaitTime = 500
) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    fn();
  }, awaitTime || 0);
};

export const createCAPLink = (transaction: string): string => {
  return `https://explorer.cap.ooo/app-transactions/${ENV.canisterIds.swap}/${transaction}`;
};
