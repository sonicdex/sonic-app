import { Principal } from '@dfinity/principal';

import { ENV } from '@/config';

import { MappedCapHistoryLog } from '..';
import { getCapRootInstance } from '../connection';
import { CapHistoryLog } from '../history-log';
import { parseCapHistoryLog } from '../utils';

export interface UserTransactionsResponse {
  data: MappedCapHistoryLog[];
  page: number;
}

export const getUserTransactions = async ( principalId: string, page?: number): Promise<UserTransactionsResponse> => {
  const capRoot = await getCapRootInstance({ canisterId: ENV.canistersPrincipalIDs.swapCapRoot});
  
  const result = (await capRoot.get_user_transactions({
    user: Principal.fromText(principalId) as any, page,
  })) as { data: CapHistoryLog[]; page: number };

  return {
    data: parseCapHistoryLog(Object.values(result.data.reverse())), page: result.page,
  };
};
