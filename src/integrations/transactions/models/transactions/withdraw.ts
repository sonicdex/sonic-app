import { AppTokenMetadata } from '@/models';

export type Withdraw = {
  amount: string;
  token?: AppTokenMetadata;
};
