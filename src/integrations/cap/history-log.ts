import { Principal } from '@dfinity/principal';

export type CapHistoryLog = {
  caller: Principal;
  details: [string, any][];
  time: bigint;
  operation: string;
};
