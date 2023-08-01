import { useEffect } from 'react';
import { getFromStorage, saveToStorage } from '@/utils';
import { AppLog , tokenList} from '@/utils';


// not using
export const useTokenLogosFetcherInit = (): void => {
  const supportedTokenList = tokenList('array');
  useEffect(() => {
    if (!supportedTokenList) return;
    Promise.all(
      supportedTokenList.map(async (token:{id:string}) => {
        const storageKey = `${token.id}-logo`;
        const logo = getFromStorage(storageKey);
        if (!logo) {
          try {
            var tokenLogo = "https://cdn.sonic.ooo/icons/"+token.id ; // await getTokenLogo(token.id);
            saveToStorage(storageKey, tokenLogo);        
          } catch (e) {
            AppLog.error(`Token logo fetch error: token=${token.id}`, e);
          }
        }
      })
    );
  }, [supportedTokenList]);
};
