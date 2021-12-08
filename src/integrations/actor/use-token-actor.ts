import { useEffect, useState } from 'react';

import { FeatureState, usePlugStore } from '@/store';
import { TokenIDL } from '@/did';

import { ActorAdapter } from './actor-adapter';

export type UseGetActorOptions = {
  canisterId?: string | null;
};

export const useTokenActor = (props: UseGetActorOptions = {}) => {
  const [state, setState] = useState<FeatureState>(FeatureState.Idle);
  const [actor, setActor] = useState<TokenIDL.Factory>();
  const { isConnected } = usePlugStore();

  async function getActor(canisterId: string) {
    setState(FeatureState.Loading);
    new ActorAdapter(window.ic?.plug)
      .createActor<TokenIDL.Factory>(canisterId, TokenIDL.factory)
      .then((actor) => setActor(actor))
      .catch((error) => console.error(error))
      .finally(() => setState(FeatureState.Idle));
  }

  useEffect(() => {
    if (isConnected && props.canisterId) {
      getActor(props.canisterId);
    } else {
      setActor(undefined);
    }
  }, [isConnected]);

  return {
    actor,
    state,
    setState,
    getActor,
  };
};
