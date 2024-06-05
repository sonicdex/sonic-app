import { useEffect } from 'react';

export const useHeaderResizeEffect = (
  callback: (element: HTMLElement) => void
) => {
  useEffect(() => {
    
    const target = document.getElementById('header');
    const resizeObserver = new ResizeObserver(() => {
      // const header = document.getElementById('header');
      if (target) {
        
        document.documentElement.style?.setProperty('--header-height',`${target.clientHeight as any }`)
       
      }
    });
    
    if (target) {
      document.documentElement.style?.setProperty('--header-height',`${target.clientHeight as any }`)
      resizeObserver.observe(target);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [callback]);
};
