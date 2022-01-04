import { ENV } from '@/config';
import { LedgerIDL } from '@/did';

import { useActor } from '.';

export const useLedgerActor = () =>
  useActor<LedgerIDL.Factory>({
    canisterId: ENV.canisterIds.ledger,
    interfaceFactory: LedgerIDL.factory,
  });
