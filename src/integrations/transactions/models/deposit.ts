import { TokenMetadata } from '@/models';

export type Deposit = {
  token?: TokenMetadata;
  amount: string;
};
