import { TokenMetadata } from '@/models';

export type Withdraw = {
  token?: TokenMetadata;
  amount: string;
};
