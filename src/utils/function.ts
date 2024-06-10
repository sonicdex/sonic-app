let timer: string | number | null = null;

export const debounce = (
  fn: (...args: unknown[]) => unknown,
  awaitTime = 500
) => {

  if (timer) clearTimeout(timer);
  timer = window.setTimeout(() => {
    fn();
  }, awaitTime || 0);
};



