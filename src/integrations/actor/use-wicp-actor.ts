import { ENV } from '@/config';
import { TokenIDL } from '@/did';

import { useActor } from '.';

export const useWICPActor = () =>
  useActor<TokenIDL.Factory>({
    canisterId: ENV.canisterIds.WICP,
    interfaceFactory: TokenIDL.factory,
  });
