import { ENV } from '@/config';
import { LedgerIDL, SwapIDL, TokenIDL, SwapStorageIDL } from '@/did';
import { useActorStore } from '@/store/features/actor';
import { useActorEffect } from './use-actor-effect';
import { useLedgerActor } from './use-ledger-actor';
import { useSwapActor } from './use-swap-actor';
import { useSwapStorageActor } from './use-swap-storage-actor';
import { useWICPActor } from './use-wicp-actor';
import { useXTCActor } from './use-xtc-actor';

export const useActorsInit = () => {
  const { setActors, setTokenActors } = useActorStore();

  const ledgerActor = useLedgerActor();
  const swapActor = useSwapActor();
  const swapStorageActor = useSwapStorageActor();
  const wicpActor = useWICPActor();
  const xtcActor = useXTCActor();

  useActorEffect({
    actor: ledgerActor,
    setActor: (ledger: LedgerIDL.Factory) => setActors({ ledger }),
  });
  useActorEffect({
    actor: swapActor,
    setActor: (swap: SwapIDL.Factory) => setActors({ swap }),
  });
  useActorEffect({
    actor: swapStorageActor,
    setActor: (swapStorage: SwapStorageIDL.Factory) =>
      setActors({ swapStorage }),
  });
  useActorEffect({
    actor: wicpActor,
    setActor: (wicp: TokenIDL.Factory) =>
      setTokenActors({ [ENV.canisterIds.WICP]: wicp }),
  });
  useActorEffect({
    actor: xtcActor,
    setActor: (xtc: TokenIDL.Factory) =>
      setTokenActors({ [ENV.canisterIds.XTC]: xtc }),
  });
};
