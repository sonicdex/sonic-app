import { Principal } from '@dfinity/principal';

import { ENV } from '@/config';

import { MappedCapHistoryLog } from '..';
import { getCapRootInstance } from '../connection';
import { CapHistoryLog } from '../history-log';
import { parseCapHistoryLog } from '../utils';

export const getUserTransactions = async (
  principalId: string,
  page = 0
): Promise<MappedCapHistoryLog[]> => {
  const capRoot = await getCapRootInstance({
    canisterId: ENV.canistersPrincipalIDs.swapCapRoot,
  });

  const result = (await capRoot.get_user_transactions({
    user: Principal.fromText(principalId),
    page,
  })) as { data: CapHistoryLog[] };

  return parseCapHistoryLog(Object.values(result.data.reverse()));
};
