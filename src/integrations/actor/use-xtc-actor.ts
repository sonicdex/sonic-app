import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { useActor } from '.';

export const useXTCActor = () =>
  useActor<TokenIDL.Factory>({
    canisterId: ENV.canisterIds.XTC,
    interfaceFactory: TokenIDL.factory,
  });
