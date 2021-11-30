import { Principal } from '@dfinity/principal';

export type Deposit = {
  tokenId: Principal;
  amount: number;
};
