import Provider from '@psychedelic/plug-inpage-provider';
import { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';

export class BatchTransactions {
  private transactions: Transaction[] = [];

  constructor(
    private provider: Provider,
    private confirmRetry?: () => Promise<boolean>
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
    const result = await this.provider.batchTransactions(this.transactions);
    return result;
  }

  private handleTransactionSuccess(
    transaction: Transaction,
    response: unknown
  ): Promise<unknown> {
    this.pop();
    return transaction.onSuccess(response);
  }

  private async handleTransactionFail(
    transaction: Transaction,
    error: unknown
  ): Promise<unknown> {
    // TODO: ask retry
    const retry = this.confirmRetry && (await this.confirmRetry());
    if (retry) {
      // if retry
      return this.execute();
    } else {
      // if not retry
      return transaction.onFail(error);
    }
  }

  private pop(): void {
    this.transactions.pop();
  }
}
