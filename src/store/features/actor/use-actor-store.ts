import { TokenIDL } from '@/did';
import { AppActors } from '@/integrations/actor';
import { useAppDispatch, useAppSelector } from '@/store';

import { selectActorState, setActors, setTokenActors } from '.';

export const useActorStore = () => {
  const { actors, tokenActors, state } = useAppSelector(selectActorState);
  const dispatch = useAppDispatch();

  const _setActors = (actors: AppActors[]) => {
    dispatch(setActors(actors));
  };

  const _setTokenActors = (actors: TokenIDL.Factory) => {
    dispatch(setTokenActors(actors));
  };

  return {
    actors,
    tokenActors,
    state,
    setActors: _setActors,
    setTokenActors: _setTokenActors,
  };
};
