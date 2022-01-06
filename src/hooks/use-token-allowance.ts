import { Principal } from '@dfinity/principal';
import { useEffect, useState } from 'react';

import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { useActor } from '@/integrations/actor';
import { usePlugStore } from '@/store';

export const useTokenAllowance = (tokenId?: string): number | undefined => {
  const { principalId } = usePlugStore();
  const [allowance, setAllowance] = useState<number | undefined>(undefined);

  const actor = useActor<TokenIDL.Factory>({
    canisterId: tokenId,
    interfaceFactory: TokenIDL.factory,
  });

  useEffect(() => {
    if (actor && principalId) {
      actor
        .allowance(
          Principal.fromText(principalId),
          Principal.fromText(ENV.canisterIds.swap)
        )
        .then((res) => {
          setAllowance(Number(res));
        })
        .catch((e) => {
          console.error('getAllowance error', e);
          setAllowance(undefined);
        });
    }
  }, [actor, principalId]);

  return allowance;
};
