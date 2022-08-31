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
