import { useEffect } from 'react';

import { useActorStore } from '@/store/features/actor';

export const useSwapInit = () => {
  const { actors } = useActorStore();
  const { swap: swapActor } = actors;

  useEffect(() => {
    async function getSupportedTokenList() {
      if (swapActor) {
        const result = await swapActor.getSupportedTokenList();

        console.log(result);
      }
    }

    getSupportedTokenList();
  }, [swapActor]);
};
