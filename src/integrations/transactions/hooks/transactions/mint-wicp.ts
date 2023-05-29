import { ENV } from '@/config';
import { TokenIDL } from '@/did';
import { CreateTransaction, MintWICP } from '../../models';

export const getMintWICPTransaction: CreateTransaction<MintWICP> = (options = {},onSuccess,onFail) => {
  const { blockHeight, subaccount = [] } = options;
  return {
    canisterId: ENV.canistersPrincipalIDs.WICP,
    idl: TokenIDL.DIP20.factory,
    methodName: 'mint',
    onSuccess: async (res: TokenIDL.DIP20.Result) => {
      if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
      if (onSuccess) onSuccess(res);
    },
    onFail,
    args:[subaccount , blockHeight]
  };
};
