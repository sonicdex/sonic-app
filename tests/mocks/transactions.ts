import type { Transaction } from '@psychedelic/plug-inpage-provider/dist/src/Provider';

export const mockTransaction = ({
  args,
  canisterId,
  idl,
  methodName,
  onSuccess,
  onFail,
}: Partial<Transaction> = {}): Transaction => ({
  args: args || [],
  canisterId: canisterId || 'any_canister_id',
  idl: idl || ((() => undefined) as any),
  methodName: methodName || 'any_method_name',
  onFail: onFail || ((res) => Promise.resolve(res)),
  onSuccess: onSuccess || ((res) => Promise.resolve(res)),
});
