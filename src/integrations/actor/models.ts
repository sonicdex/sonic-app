import { IDL } from '@dfinity/candid';

import { LedgerIDL, SwapIDL, SwapStorageIDL, TokenIDL } from '@/did';
import { CyclesMintingIDL } from '@/did/sonic/cycles-minting.did';

export type AppActors =
  | LedgerIDL.Factory
  | SwapIDL.Factory
  | SwapStorageIDL.Factory
  | TokenIDL.Factory
  | CyclesMintingIDL.Factory;

export interface ActorRepository {
  createActor: <T extends AppActors>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ) => Promise<T>;
}

export type ActorProps = {
  canisterId?: string;
  interfaceFactory: IDL.InterfaceFactory;
};
