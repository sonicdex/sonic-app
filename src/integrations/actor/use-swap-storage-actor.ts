import { ENV } from '@/config';
import { SwapStorageIDL } from '@/did';
import { useActor } from '.';

export const useSwapStorageActor = () =>
  useActor<SwapStorageIDL.Factory>({
    canisterId: ENV.canisterIds.swapStorage,
    interfaceFactory: SwapStorageIDL.factory,
  });
