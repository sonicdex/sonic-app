import { AppTokenMetadata } from '@/models';

export type Transfer = {
  token?: AppTokenMetadata;
  amount?: string;
  address?:string;
  addressType?:string;
};
