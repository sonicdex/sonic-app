import Provider from '@memecake/plug-inpage-provider';
import type {
  Transaction,
  TransactionPrevResponse,
} from '@memecake/plug-inpage-provider/dist/src/Provider/interfaces';

import { AppLog } from '@/utils';

import { Batch } from './models/batch';

export class BatchTransactions implements Batch.Controller {
  private transactions: Transaction[] = [];
  private state: Batch.State = Batch.State.Idle;
  private batchTransactionResolver?: (value: unknown) => void;
  private batchTransactionRejector?: (value: unknown) => void;

  constructor(
    private provider?: Provider,
    private handleRetry?: (
      error: unknown,
      prevResponses?: TransactionPrevResponse[]
    ) => Promise<boolean | { nextTxArgs: any }>
  ) {}

  public push(transaction: Transaction): BatchTransactions {
    this.transactions.push({
      ...transaction,
      onSuccess: (response) =>
        this.handleTransactionSuccess(transaction, response),
      onFail: (error, prevResponses) => {
        AppLog.error(`Batch Transaction`, transaction, error, prevResponses);
        return this.handleTransactionFail(transaction, error, prevResponses);
      },
    });
    return this;
  }

  public async execute(): Promise<unknown> {
    if (this.state !== Batch.State.Idle) {
      return Promise.reject(Batch.State.Running);
    }

    if (this.transactions.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.state = Batch.State.Running;
      this.batchTransactionResolver = resolve;
      this.batchTransactionRejector = reject;
      this.start();
    });
  }

  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getState(): Batch.State {
    return this.state;
  }

  private async handleTransactionSuccess(
    transaction: Transaction,
    responses: unknown[]
  ): Promise<unknown> {
    const result = await transaction.onSuccess(responses);

    this.pop();
    if (this.transactions.length === 0) {
      this.finishPromise(true, responses);
    }
    return result;
  }

  private async handleTransactionFail(
    transaction: Transaction,
    error: unknown,
    prevResponses?: TransactionPrevResponse[]
  ): Promise<void> {
    const retryResponse =
      this.handleRetry && (await this.handleRetry(error, prevResponses));

    if (retryResponse) {
      if (typeof retryResponse !== 'boolean' && 'nextTxArgs' in retryResponse) {
        this.start(retryResponse.nextTxArgs);
      } else {
        this.start();
      }
    } else {
      await transaction.onFail(error, prevResponses);
      this.finishPromise(false, error);
    }
  }

  private pop(): void {
    this.transactions = this.transactions.slice(1);
  }

  private finishPromise(resolved: boolean, result: unknown): void {
    if (!this.batchTransactionRejector || !this.batchTransactionResolver) {
      throw new Error('Batch promise not initialized');
    }

    if (resolved) {
      this.batchTransactionResolver(result);
    } else {
      this.batchTransactionRejector(result);
    }
    this.batchTransactionResolver = undefined;
    this.batchTransactionRejector = undefined;
    this.state = Batch.State.Idle;
  }

  private start(nextTxArgs?: any): void {
    const firstTransaction = this.transactions[0];
    const otherTransactions = this.transactions.filter(
      (txData, index) => index !== 0
    );

    const transactions = nextTxArgs
      ? [
          {
            ...firstTransaction,
            args: () => firstTransaction.args(nextTxArgs),
          },
          ...(otherTransactions?.length > 0 ? otherTransactions : []),
        ]
      : this.transactions;

    this.provider?.batchTransactions(transactions).catch((error) => {
      if (this.handleRetry) {
        return this.handleRetry(error).then((response) => {
          if (response) {
            return this.start();
          } else {
            this.finishPromise(false, error);
          }
        });
      } else {
        this.finishPromise(false, error);
      }
    });
  }
}
