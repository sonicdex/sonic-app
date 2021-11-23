import { ENV } from '@/config';
import { SwapIDL } from '@/did';
import { useActor } from '.';

export const useSwapActor = () =>
  useActor<SwapIDL.Factory>({
    canisterId: ENV.canisterIds.swap,
    interfaceFactory: SwapIDL.factory,
  });
