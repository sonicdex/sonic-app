import { CapHistoryLog } from '../history-log';
import { getCapRootInstance } from '../connection';
import { Principal } from '@dfinity/principal';
import { ENV } from '@/config';

export const getUserTransactions = async (
  principalId: string,
  page = 0
): Promise<CapHistoryLog[]> => {
  const capRoot = await getCapRootInstance({
    canisterId: ENV.canisterIds.swapCapRoot,
  });

  const result = (await capRoot.get_user_transactions({
    user: Principal.fromText(principalId),
    page,
  })) as { data: CapHistoryLog[] };

  return Object.values(result.data);
};
