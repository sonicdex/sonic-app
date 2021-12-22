import { CapHistoryLog } from '../history-log';
import { getCapRootInstance } from '../connection';
import { Principal } from '@dfinity/principal';
import { ENV } from '@/config';
import { parseCapHistoryLog } from '../utils';
import { MappedCapHistoryLog } from '..';

export const getUserTransactions = async (
  principalId: string,
  page = 0
): Promise<MappedCapHistoryLog[]> => {
  const capRoot = await getCapRootInstance({
    canisterId: ENV.canisterIds.swapCapRoot,
  });

  const result = (await capRoot.get_user_transactions({
    user: Principal.fromText(principalId),
    page,
  })) as { data: CapHistoryLog[] };

  return parseCapHistoryLog(Object.values(result.data));
};
