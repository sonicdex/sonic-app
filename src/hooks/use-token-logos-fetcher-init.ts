import { useEffect } from 'react';
import { createAnonTokenActor } from '@/integrations/actor';
import { useSwapCanisterStore } from '@/store';
import { getFromStorage, saveToStorage } from '@/utils';
import { AppLog } from '@/utils';

export const useTokenLogosFetcherInit = (): void => {
  const { supportedTokenList } = useSwapCanisterStore();
  console.log('supportedTokenList',supportedTokenList)
  useEffect(() => {
    if (!supportedTokenList) return;
    Promise.all(
      supportedTokenList.map(async (token) => {
        const storageKey = `${token.id}-logo`;
        const logo = getFromStorage(storageKey);
        if (!logo) {
          try {
            const tokenActor = await createAnonTokenActor(token.id , token?.tokenType );
            var tokenLogo = ''
            if(!token?.tokenType || token?.tokenType == 'DIP20' || token?.tokenType =='YC'){
              tokenLogo = await tokenActor.logo();
              saveToStorage(storageKey, tokenLogo);
            }else if(token?.tokenType == 'ICRC1'){
              saveToStorage(storageKey, token.logo);
            }          
          } catch (e) {
            AppLog.error(`Token logo fetch error: token=${token.id}`, e);
          }
        }
      })
    );
  }, [supportedTokenList]);
};
