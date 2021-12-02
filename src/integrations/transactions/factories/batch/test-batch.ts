import { createBatchHook } from '..';
import { createSupportedTokenListTransaction } from '../transactions/supported-token-list';

export const createTestBatch = () =>
  createBatchHook({
    states: {
      Idle: 'idle',
      Done: 'done',
      Error: 'error',
      0: 'test1',
      1: 'test2',
      2: 'test3',
    },
    transactions: [
      createSupportedTokenListTransaction(null, async (res) =>
        console.log(res)
      ),
      createSupportedTokenListTransaction(null, async (res) =>
        console.log(res)
      ),
      createSupportedTokenListTransaction(null, async (res) =>
        console.log(res)
      ),
    ],
  });
