import { ENV } from '@/config';

let timer: any | null = null;

export const debounce = (fn: Function, awaitTime: number = 500) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    fn();
  }, awaitTime || 0);
};

export const createCAPLink = (transaction: string): string => {
  return `https://explorer.cap.ooo/app-transactions/${ENV.canisterIds.swap}/${transaction}`;
};
