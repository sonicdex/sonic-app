import { Principal } from '@dfinity/principal';

export type Withdraw = {
  tokenId: Principal;
  amount: number;
};
