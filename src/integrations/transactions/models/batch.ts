import type { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { CreateTransaction } from '.';

export namespace Batch {
  export enum State {
    Idle = 'idle',
    Running = 'running',
  }

  export type Execute = () => Promise<unknown>;

  export type Push = (transaction: Transaction) => Controller;

  export type GetTransactions = () => Transaction[];

  export type GetState = () => State;

  export interface Controller {
    execute: Execute;
    push: Push;
    getTransactions: GetTransactions;
    getState: GetState;
  }

  export type DefaultHookState = 'idle' | 'done' | 'error';

  export const DefaultHookStates = {
    Idle: 'idle',
    Done: 'done',
    Error: 'error',
  };

  export type HookState = {
    [key: number]: string;
  };

  export interface Hook<State extends PropertyKey> {
    execute: Batch.Execute;
    state: State | DefaultHookState;
    error: unknown;
  }

  export interface HookProps<Model> {
    transactions: {
      [key: string]: ReturnType<CreateTransaction<Model, Transaction>>;
    };
  }

  export type CreateHook = <Model, S extends HookProps<Model>>(
    props: S
  ) => Hook<keyof S['transactions']>;
}
