
interface Transaction<SuccessResponse = unknown[]> {
  idl: any;
  canisterId: string;
  methodName: string;
  args: (responses?: any[]) => any[] | any[];
  onSuccess: (res: SuccessResponse) => Promise<any>;
  onFail: (err: any, responses?: any[]) => Promise<void>;
}


export type CreateTransaction<M, T extends Transaction = any, A = any> = (
  model: M,
  onSuccess?: T['onSuccess'],
  onFail?: T['onFail'],
  extraArgs?: A
) => T;
