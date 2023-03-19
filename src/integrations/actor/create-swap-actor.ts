import { ActorAdapter  } from '@memecake/sonic-js';

import { SwapIDL } from "@/did"

import { ENV } from '@/config';

import { plug } from '../plug';

export const createSwapActor = async (): Promise<SwapIDL.Factory> => {
  const actorAdapter = new ActorAdapter(plug as any);
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
