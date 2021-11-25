import { useActorStore } from '@/store/features/actor';
import { useActorEffect } from './use-actor-effect';
import { useLedgerActor } from './use-ledger-actor';
import { useSwapActor } from './use-swap-actor';
import { useSwapStorageActor } from './use-swap-storage-actor';
import { useWICPActor } from './use-wicp-actor';
import { useXTCActor } from './use-xtc-actor';

export const useActorsInit = () => {
  const { setActors } = useActorStore();

  const ledgerActor = useLedgerActor();
  const swapActor = useSwapActor();
  const swapStorageActor = useSwapStorageActor();
  const wicpActor = useWICPActor();
  const xtcActor = useXTCActor();

  useActorEffect({
    actor: ledgerActor,
    setActor: (ledgerActor) => setActors([ledgerActor]),
  });
  useActorEffect({
    actor: swapActor,
    setActor: (swapActor) => setActors([swapActor]),
  });
  useActorEffect({
    actor: swapStorageActor,
    setActor: (swapStorageActor) => setActors([swapStorageActor]),
  });
  useActorEffect({
    actor: wicpActor,
    setActor: (wicpActor) => setActors([wicpActor]),
  });
  useActorEffect({
    actor: xtcActor,
    setActor: (xtcActor) => setActors([xtcActor]),
  });
};
