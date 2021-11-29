import { Principal } from '@dfinity/principal';

export type Withdraw = {
  principal: Principal;
  amount: number;
};
