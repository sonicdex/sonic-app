import { Principal } from '@dfinity/principal';

export type CapHistoryLog = {
  caller: Principal;
  details: [string, any][];
  time: bigint;
  operation: string;
};

export type MappedCapHistoryLog = {
  caller: Principal;
  details: { [key: string]: any };
  time: number;
  operation: string;
};
