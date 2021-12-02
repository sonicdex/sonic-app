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

  export type HookState = {
    Idle: 'idle';
    Done: 'done';
    Error: 'error';
    [key: number]: string;
  };

  export interface Hook<State extends HookState> {
    execute: Batch.Execute;
    state: State;
    error: unknown;
  }

  export interface HookProps<Model, State extends HookState> {
    states: State;
    transactions: ReturnType<CreateTransaction<Model, Transaction>>[];
  }

  export type CreateHook = <Model, State extends HookState>(
    props: Batch.HookProps<Model, State>
  ) => Batch.Hook<State>;
}
