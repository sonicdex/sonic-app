import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';

export type CreateTransaction<M, T extends Transaction, A = any> = (
  model: M,
  onSuccess?: T['onSuccess'],
  onFail?: T['onFail'],
  extraArgs?: A
) => T;
