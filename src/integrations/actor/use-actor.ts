import { useEffect, useState } from 'react';

import { usePlugStore } from '@/store';

import { ActorAdapter } from './actor-adapter';
import { ActorProps, AppActors } from './models';

export const useActor = <T extends AppActors>(
  props: ActorProps
): T | undefined => {
  const [actor, setActor] = useState<T>();
  const { isConnected } = usePlugStore();

  useEffect(() => {
    setActor(undefined);
    if (!props.canisterId) return;
    new ActorAdapter(isConnected ? window.ic?.plug : undefined)
      .createActor<T>(props.canisterId, props.interfaceFactory)
      .then((newActor) => setActor(newActor))
      .catch((error) => console.error(error));
  }, [isConnected, props.canisterId, props.interfaceFactory]);

  return actor;
};
