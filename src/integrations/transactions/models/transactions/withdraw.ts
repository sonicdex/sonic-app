import { TokenMetadata } from '@/models';

export type Withdraw = {
  amount: string;
  token?: TokenMetadata;
};
