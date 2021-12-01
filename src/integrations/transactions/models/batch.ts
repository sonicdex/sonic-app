import type { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';

export namespace Batch {
  export enum State {
    Idle = 'idle',
    Running = 'running',
  }

  export type Execute = (transactions: Transaction[]) => Promise<unknown>;

  export type Push = (transaction: Transaction) => Controller;

  export type GetTransactions = () => Transaction[];

  export type GetState = () => State;

  export interface Controller {
    execute: Execute;
    push: Push;
    getTransactions: GetTransactions;
    getState: GetState;
  }
}
