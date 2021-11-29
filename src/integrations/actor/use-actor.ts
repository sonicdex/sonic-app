import { useEffect, useState } from 'react';

import { usePlugStore } from '@/store';

import { ActorAdapter } from './actor-adapter';
import { ActorProps, AppActors } from './models';

export const useActor = <T extends AppActors>(props: ActorProps): T | null => {
  const [actor, setActor] = useState<T>();
  const { isConnected } = usePlugStore();

  useEffect(() => {
    if (isConnected) {
      new ActorAdapter(window.ic.plug)
        .createActor<T>(props.canisterId, props.interfaceFactory)
        .then((newActor) => setActor(newActor))
        .catch((error) => console.error(error));
    } else {
      setActor(null);
    }
  }, [isConnected]);

  return actor;
};
