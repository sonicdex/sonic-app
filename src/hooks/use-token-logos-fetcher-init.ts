import { useEffect } from 'react';
import { createAnonTokenActor } from '@/integrations/actor';
import { useSwapCanisterStore } from '@/store';
import { getFromStorage, saveToStorage } from '@/utils';
import { AppLog , getWalletTokenBalance} from '@/utils';



export const useTokenLogosFetcherInit = (): void => {
  const { supportedTokenList } = useSwapCanisterStore();
  useEffect(() => {
    if (!supportedTokenList) return;
    
    Promise.all(
      supportedTokenList.map(async (token) => {
        getWalletTokenBalance(token.id , token?.tokenType )
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
