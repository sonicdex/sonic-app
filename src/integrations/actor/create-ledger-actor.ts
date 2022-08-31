import { ActorAdapter } from '@psychedelic/sonic-js';

import { ENV } from '@/config';
import { LedgerIDL } from '@/did';

export const createAnonLedgerActor = async (): Promise<LedgerIDL.Factory> => {
  return ActorAdapter.createAnonymousActor(
    ENV.canistersPrincipalIDs.ledger,
    LedgerIDL.factory
  );
};
