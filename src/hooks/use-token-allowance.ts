import { Principal } from '@dfinity/principal';
import { useEffect, useState } from 'react';

import { TokenIDL } from '@/did';
import { useActor } from '@/integrations/actor';
import { usePlugStore } from '@/store';

export const useTokenAllowance = (tokenId = ''): number => {
  const { principalId } = usePlugStore();
  const [allowance, setAllowance] = useState(0);

  const actor = useActor<TokenIDL.Factory>({
    canisterId: tokenId,
    interfaceFactory: TokenIDL.factory,
  });

  useEffect(() => {
    if (actor && principalId) {
      actor
        .allowance(Principal.fromText(principalId), Principal.fromText(tokenId))
        .then((res) => {
          console.log('res', res);
          setAllowance(Number(res));
        })
        .catch((e) => {
          console.error('getAllowance error', e);
          setAllowance(0);
        });
    }
  }, [tokenId, actor, principalId]);

  return allowance;
};
