import { useLedgerActor } from './use-ledger-actor';
import { useSwapStorageActor } from './use-swap-storage-actor';
import { useWICPActor } from './use-wicp-actor';
import { useXTCActor } from './use-xtc-actor';

export const useActorsInit = () => {
  useLedgerActor();
  useSwapStorageActor();
  useWICPActor();
  useXTCActor();
};
