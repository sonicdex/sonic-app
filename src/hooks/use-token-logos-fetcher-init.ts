import { useEffect } from 'react';

import { getFromStorage, saveToStorage } from '@/config';
import { createAnonTokenActor } from '@/integrations/actor';
import { useSwapCanisterStore } from '@/store';
import { AppLog } from '@/utils';

export const useTokenLogosFetcherInit = (): void => {
  const { supportedTokenList } = useSwapCanisterStore();

  useEffect(() => {
    if (!supportedTokenList) return;
    Promise.all(
      supportedTokenList.map(async (token) => {
        const storageKey = `${token.id}-logo`;
        const logo = getFromStorage(storageKey);

        if (!logo) {
          const tokenActor = await createAnonTokenActor(token.id);
          try {
            const tokenLogo = await tokenActor.logo();
            saveToStorage(storageKey, tokenLogo);
          } catch (e) {
            AppLog.error(`Token logo fetch error: token=${token.id}`, e);
          }
        }
      })
    );
  }, [supportedTokenList]);
};

