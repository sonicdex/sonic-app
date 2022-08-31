import { ActorAdapter, SwapIDL } from '@psychedelic/sonic-js';

import { ENV } from '@/config';

import { plug } from '../plug';

export const createSwapActor = async (): Promise<SwapIDL.Factory> => {
  const actorAdapter = new ActorAdapter(plug);
  return actorAdapter.createActor(
    ENV.canistersPrincipalIDs.swap,
    SwapIDL.factory
  );
};

export const createAnonSwapActor = async (): Promise<SwapIDL.Factory> => {
  return ActorAdapter.createAnonymousActor(
    ENV.canistersPrincipalIDs.swap,
    SwapIDL.factory
  );
};
