import { useEffect } from 'react';

import { AppActors } from '.';

type UseActorEffectOptions = {
  actor?: AppActors;
  setActor: (actor: AppActors) => void;
};

export const useActorEffect = ({
  actor,
  setActor,
}: UseActorEffectOptions): void => {
  useEffect(() => {
    if (actor) {
      setActor(actor);
      return;
    }

    setActor(null);
  }, [actor, setActor]);
};
