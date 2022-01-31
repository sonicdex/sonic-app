import { ENV } from '@/config';
import { XTCIDL } from '@/did';

import { CreateTransaction, MintXTC } from '../../models';

export const getMintXTCTransaction: CreateTransaction<MintXTC> = (
  options = {},
  onSuccess,
  onFail
) => {
  const { blockHeight, subaccount = [] } = options;
  return {
    canisterId: ENV.canistersPrincipalIDs.XTC,
    idl: XTCIDL.factory,
    methodName: 'mint_by_icp',
    onSuccess: async (res: XTCIDL.TxReceipt) => {
      if ('Err' in res) throw new Error(JSON.stringify(Object.keys(res.Err)));
      if (onSuccess) onSuccess(res);
    },
    onFail,
    args: (prevResponses: any[]) => {
      const argBlockHeight = prevResponses[0]?.response;

      return [subaccount, blockHeight ?? argBlockHeight];
    },
  };
};
