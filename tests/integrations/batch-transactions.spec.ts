import {
  BatchTransactions,
  BatchTransactionState,
} from '@/integrations/transactions';
import { batchTransactionFailMock, mockPlugProvider } from '@tests/mocks/plug';
import { mockTransaction } from '../mocks/transactions';

const makeSut = () => {
  const plugMock = mockPlugProvider();
  const confirmRetryMock = jest.fn(() => Promise.resolve(true));
  const sut = new BatchTransactions(plugMock, confirmRetryMock);

  return {
    sut,
    plugMock,
    confirmRetryMock,
  };
};

describe('BatchTransactions', () => {
  let builtSut: ReturnType<typeof makeSut>;

  beforeEach(() => {
    builtSut = makeSut();
    builtSut.sut.push(mockTransaction());
    builtSut.sut.push(mockTransaction());
    builtSut.sut.push(mockTransaction());
  });

  test('should be defined', () => {
    const sut = makeSut();
    expect(sut).toBeDefined();
  });

  test('should resolve all transactions', async () => {
    const { sut, plugMock } = builtSut;
    const providerBatchTransactions = jest.spyOn(plugMock, 'batchTransactions');

    const result = await sut.execute();

    expect(result).toBe(true);
    expect(sut.getTransactions()).toHaveLength(0);
    expect(providerBatchTransactions).toHaveBeenCalledTimes(1);
  });

  test('should resolve ask retry and complete', async () => {
    const { sut, confirmRetryMock, plugMock } = builtSut;
    const providerBatchTransactions = jest
      .spyOn(plugMock, 'batchTransactions')
      .mockImplementationOnce(batchTransactionFailMock);

    const result = await sut.execute();

    expect(confirmRetryMock).toHaveBeenCalledTimes(1);
    expect(providerBatchTransactions).toHaveBeenCalledTimes(2);
    expect(result).toBe(true);
    expect(sut.getTransactions()).toHaveLength(0);
  });

  test('should resolve ask retry and fail', async () => {
    const { sut, confirmRetryMock, plugMock } = builtSut;
    confirmRetryMock.mockImplementationOnce(() => Promise.resolve(false));
    jest
      .spyOn(plugMock, 'batchTransactions')
      .mockImplementationOnce(batchTransactionFailMock);

    await expect(sut.execute()).rejects.toEqual(false);
    expect(sut.getTransactions()).toHaveLength(3);
    expect(confirmRetryMock).toHaveBeenCalledTimes(1);
  });

  test('should throw if already is running', async () => {
    const { sut } = builtSut;
    sut.execute();
    await expect(sut.execute()).rejects.toEqual(BatchTransactionState.Running);
  });

  test('should has running state after start execute', async () => {
    const { sut } = builtSut;
    sut.execute();
    expect(sut.getState()).toBe(BatchTransactionState.Running);
  });

  test('should resolve for empty transactions', async () => {
    const { sut } = makeSut();
    await expect(sut.execute()).resolves.toBeUndefined();
  });
});
