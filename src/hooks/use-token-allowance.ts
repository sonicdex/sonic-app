import { Principal } from '@dfinity/principal';
import { useEffect, useState } from 'react';

import { ENV } from '@/config';
import { createAnonTokenActor } from '@/integrations/actor';
import { usePlugStore } from '@/store';
import { AppLog } from '@/utils';

export const useTokenAllowance = (tokenId?: string): number | undefined => {
  const { principalId } = usePlugStore();
  const [allowance, setAllowance] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (tokenId && principalId) {
      (async () => {
        try {
          const actor = await createAnonTokenActor(tokenId);
          const allowance = await actor.allowance(
            Principal.fromText(principalId),
            Principal.fromText(ENV.canistersPrincipalIDs.swap)
          );
          setAllowance(Number(allowance));
        } catch (error) {
          AppLog.error(
            `Allowance fetch error: token=${tokenId} principal=${principalId}`,
            error
          );
          setAllowance(undefined);
        }
      })();
    }
  }, [tokenId, principalId]);

  return allowance;
};

