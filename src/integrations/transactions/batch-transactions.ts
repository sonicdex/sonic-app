import Provider from '@psychedelic/plug-inpage-provider';
import type { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';
import { Batch } from './models/batch';

export class BatchTransactions implements Batch.Controller {
  private transactions: Transaction[] = [];
  private state: Batch.State = Batch.State.Idle;
  private batchTransactionResolver?: (value: unknown) => void;
  private batchTransactionRejector?: (value: unknown) => void;

  constructor(
    private provider?: Provider,
    private handleRetry?: (error: unknown) => Promise<boolean>
  ) {}

  public push(transaction: Transaction): BatchTransactions {
    this.transactions.push({
      ...transaction,
      onSuccess: (response) =>
        this.handleTransactionSuccess(transaction, response),
      onFail: (error) => this.handleTransactionFail(transaction, error),
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
    response: unknown
  ): Promise<unknown> {
    const result = await transaction.onSuccess(response);

    console.log('TXR', result);
    this.pop();
    if (this.transactions.length === 0) {
      this.finishPromise(true, response);
    }
    return result;
  }

  private async handleTransactionFail(
    transaction: Transaction,
    error: unknown
  ): Promise<unknown> {
    const retry = this.handleRetry && (await this.handleRetry(error));
    if (retry) {
      return this.start();
    } else {
      await transaction.onFail(error);
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

  private start(): void {
    this.provider?.batchTransactions(this.transactions).catch((error) => {
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
