
import { CreateTransaction } from '.';

export namespace Batch {
  export enum State {
    Idle = 'idle',
    Running = 'running',
  }

  export type Execute = () => Promise<unknown>;

  export type Push = (transaction: any) => Controller;

  export type GetTransactions = () => any[];

  export type GetState = () => State;

  export interface Controller {
    execute: Execute;
    push: Push;
    getTransactions: GetTransactions;
    getState: GetState;
  }

  export enum DefaultHookState {
    Idle = 'idle',
    Done = 'done',
    Error = 'error',
  }

  export type HookState = {
    [key: number]: string;
  };

  export interface Hook<State> {
    execute: Batch.Execute;
    state: State | DefaultHookState;
    error: unknown;
  }

  export interface HookProps<Model> {
    transactions: {
      [key: string]: ReturnType<CreateTransaction<Model, any>>;
    };
    handleRetry?: (
      error: unknown,
      prevResponses?: any[]
    ) => Promise<boolean | { nextTxArgs: unknown }>;
  }
}
