import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { useAppDispatch, useAppSelector } from '@/store';
import { Actor, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';

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

  return {
    actors,
    tokenActors,
    state,
    setActors: _setActors,
    setTokenActors: _setTokenActors,
  };
};
