import { Batch } from './batch';

export type CreateBatch<T> = (params: T) => Batch.Execute;
