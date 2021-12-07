import { SupportedToken } from '@/models';

export type Deposit = {
  token: SupportedToken;
  amount: string;
};
