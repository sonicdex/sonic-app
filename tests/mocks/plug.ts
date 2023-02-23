import type { default as Provider } from '@memecake/plug-inpage-provider';
import type { Transaction } from '@memecake/plug-inpage-provider/dist/src/Provider/interfaces';

export const batchTransactionFailMock = async (transactions: Transaction[]) => {
  await transactions[0].onFail(false);
  return false;
};

export const batchTransactionsMock = async (transactions: Transaction[]) => {
  for (const { onSuccess } of transactions) {
    await onSuccess([]);
  }
  return true;
};
export const mockPlugProvider = (): Provider => {
  return {
    batchTransactions: batchTransactionsMock,
  } as any as Provider;
};

