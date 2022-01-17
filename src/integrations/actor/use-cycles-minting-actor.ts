import { ENV } from '@/config';
import { CyclesMintingIDL } from '@/did/sonic/cycles-minting.did';

import { useActor } from '.';

export const useCyclesMintingActor = () =>
  useActor<CyclesMintingIDL.Factory>({
    canisterId: ENV.canistersPrincipalIDs.cyclesMinting,
    interfaceFactory: CyclesMintingIDL.factory,
  });
