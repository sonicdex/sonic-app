import { useEffect } from 'react';

import { getFromStorage, saveToStorage } from '@/config';
import { TokenIDL } from '@/did';
import { ActorAdapter } from '@/integrations/actor';
import { useSwapCanisterStore } from '@/store';

export const useTokenLogosFetcherInit = (): void => {
  const { supportedTokenList } = useSwapCanisterStore();

  useEffect(() => {
    if (!supportedTokenList) return;
    Promise.all(
      supportedTokenList.map(async (token) => {
        const storageKey = `${token.id}-logo`;
        const logo = getFromStorage(storageKey);

        if (!logo) {
          const tokenActor: TokenIDL.Factory =
            await new ActorAdapter().createActor(token.id, TokenIDL.factory);
          try {
            const tokenLogo = await tokenActor.logo();
            saveToStorage(storageKey, tokenLogo);
          } catch (e) {
            console.error('Token Logo not found', e);
          }
        }
      })
    );
  }, [supportedTokenList]);
};
