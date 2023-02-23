import {
  ActorAdapter,
  createTokenActor as cta,
  TokenIDL,
} from '@memecake/sonic-js';

export const createTokenActor = cta;

export const createAnonTokenActor = async (
  canisterId: string
): Promise<TokenIDL.Factory> =>
  ActorAdapter.createAnonymousActor<TokenIDL.Factory>(
    canisterId,
    TokenIDL.factory
  );
