import { IDL } from '@dfinity/candid';

// TODO: Add actors for sonic canisters
export type AppActors = {};

export interface ActorRepository {
  createActor: <T extends AppActors>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ) => Promise<T>;
}

export type ActorProps = {
  canisterId: string;
  interfaceFactory: IDL.InterfaceFactory;
};
