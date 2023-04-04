import { AppTokenMetadata } from '@/models';

export type Deposit = {
  token?: AppTokenMetadata;
  amount?: string;
  allowance?: number;
  tokenAcnt?:string;
};
