import { useAppDispatch, useAppSelector } from '@/store';

import {
  Actors,
  TokenActors,
  selectActorState,
  setActors,
  setTokenActors,
} from '.';

export const useActorStore = () => {
  const { actors, tokenActors, state } = useAppSelector(selectActorState);
  const dispatch = useAppDispatch();

  const _setActors = (actors: Partial<Actors>) => {
    dispatch(setActors(actors));
  };

  const _setTokenActors = (actors: TokenActors) => {
    dispatch(setTokenActors(actors));
  };

  const getTokenActor = (canisterId: string) => {
    if (!tokenActors[canisterId]) {
    }

    return tokenActors[canisterId];
  };

  const getNewTokenActor = (cawnisterId: string) => {};

  return {
    actors,
    tokenActors,
    state,
    setActors: _setActors,
    setTokenActors: _setTokenActors,
  };
};
