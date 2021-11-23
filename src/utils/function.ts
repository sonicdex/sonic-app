let timer: any | null = null;

export const debounce = (fn: Function, awaitTime: number = 500) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    fn();
  }, awaitTime || 0);
};
