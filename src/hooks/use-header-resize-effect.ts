import { useEffect } from 'react';

export const useHeaderResizeEffect = (
  callback: (element: HTMLElement) => void
) => {
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const header = document.getElementById('header');
      if (header) {
        callback(header);
      }
    });
    const target = document.getElementById('header');
    if (target) {
      resizeObserver.observe(target);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [callback]);
};