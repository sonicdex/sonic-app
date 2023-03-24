import { useEffect } from 'react';
import { getFromStorage, saveToStorage } from '@/utils';
import { AppLog , getTokenLogo , tokenList} from '@/utils';

export const useTokenLogosFetcherInit = (): void => {
  const supportedTokenList = tokenList();
  useEffect(() => {
    if (!supportedTokenList) return;
    Promise.all(
      supportedTokenList.map(async (token) => {
        const storageKey = `${token.id}-logo`;
        const logo = getFromStorage(storageKey);
        if (!logo) {
          try {
            var tokenLogo = await getTokenLogo(token.id);
            saveToStorage(storageKey, tokenLogo);        
          } catch (e) {
            AppLog.error(`Token logo fetch error: token=${token.id}`, e);
          }
        }
      })
    );
  }, [supportedTokenList]);
};
