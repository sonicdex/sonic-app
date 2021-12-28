import { useLedgerActor } from './use-ledger-actor';
import { useWICPActor } from './use-wicp-actor';
import { useXTCActor } from './use-xtc-actor';

export const useActorsInit = () => {
  useLedgerActor();
  useWICPActor();
  useXTCActor();
};
