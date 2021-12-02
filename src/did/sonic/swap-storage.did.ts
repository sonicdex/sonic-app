import { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export namespace SwapStorageIDL {
  export interface Bucket {
    addRecords: (arg_0: Array<TxRecord>) => Promise<bigint>;
    getStatus: () => Promise<Status>;
    getTransaction: (arg_0: bigint) => Promise<TxRecord>;
    getTransactions: (arg_0: bigint, arg_1: bigint) => Promise<Array<TxRecord>>;
  }
  export interface BucketInfoExt {
    id: bigint;
    bucketId: Principal;
    start: bigint;
    length: bigint;
  }
  export type Operation =
    | { lpTransfer: null }
    | { lpApprove: null }
    | { withdraw: null }
    | { tokenTransfer: null }
    | { swap: null }
    | { addLiquidity: null }
    | { createPair: null }
    | { deposit: null }
    | { removeLiquidity: null }
    | { lpTransferFrom: null }
    | { tokenTransferFrom: null }
    | { tokenApprove: null };
  export type Operation__1 =
    | { lpTransfer: null }
    | { lpApprove: null }
    | { withdraw: null }
    | { tokenTransfer: null }
    | { swap: null }
    | { addLiquidity: null }
    | { createPair: null }
    | { deposit: null }
    | { removeLiquidity: null }
    | { lpTransferFrom: null }
    | { tokenTransferFrom: null }
    | { tokenApprove: null };
  export interface Status {
    memSize: bigint;
    storageId: Principal;
    cycles: bigint;
    start: bigint;
    length: bigint;
  }
  export interface Status__1 {
    recordsPerBucket: bigint;
    memSize: bigint;
    owner: Principal;
    txAmount: bigint;
    cycles: bigint;
    flushing: boolean;
    bufferSize: bigint;
    chunkSize: bigint;
    dswap: Principal;
    buckets: Array<BucketInfoExt>;
  }
  export interface Storage {
    addRecord: (
      arg_0: Principal,
      arg_1: Operation__1,
      arg_2: string,
      arg_3: Principal,
      arg_4: Principal,
      arg_5: bigint,
      arg_6: bigint,
      arg_7: bigint,
      arg_8: bigint,
      arg_9: Time
    ) => Promise<bigint>;
    flush: () => Promise<boolean>;
    getBucket: () => Promise<Principal>;
    getStatus: () => Promise<Status__1>;
    getTransaction: (arg_0: bigint) => Promise<TxRecord__1>;
    getTransactions: (
      arg_0: bigint,
      arg_1: bigint
    ) => Promise<Array<TxRecord__1>>;
    getUserTransactionAmount: (arg_0: Principal) => Promise<bigint>;
    getUserTransactions: (
      arg_0: Principal,
      arg_1: bigint,
      arg_2: bigint
    ) => Promise<Array<TxRecord__1>>;
    historySize: () => Promise<bigint>;
    newBucket: () => Promise<Principal>;
    setDSwapCanisterId: (arg_0: Principal) => Promise<boolean>;
  }
  export type Time = bigint;
  export interface TxRecord {
    op: Operation;
    to: Principal;
    fee: bigint;
    tokenId: string;
    from: Principal;
    amount0: bigint;
    amount1: bigint;
    timestamp: Time;
    caller: Principal;
    index: bigint;
    amount: bigint;
  }
  export interface TxRecord__1 {
    op: Operation;
    to: Principal;
    fee: bigint;
    tokenId: string;
    from: Principal;
    amount0: bigint;
    amount1: bigint;
    timestamp: Time;
    caller: Principal;
    index: bigint;
    amount: bigint;
  }
  export interface Factory extends Storage {}

  export const factory: IDL.InterfaceFactory = ({ IDL }) => {
    const Operation__1 = IDL.Variant({
      lpTransfer: IDL.Null,
      lpApprove: IDL.Null,
      withdraw: IDL.Null,
      tokenTransfer: IDL.Null,
      swap: IDL.Null,
      addLiquidity: IDL.Null,
      createPair: IDL.Null,
      deposit: IDL.Null,
      removeLiquidity: IDL.Null,
      lpTransferFrom: IDL.Null,
      tokenTransferFrom: IDL.Null,
      tokenApprove: IDL.Null,
    });
    const Time = IDL.Int;
    const Operation = IDL.Variant({
      lpTransfer: IDL.Null,
      lpApprove: IDL.Null,
      withdraw: IDL.Null,
      tokenTransfer: IDL.Null,
      swap: IDL.Null,
      addLiquidity: IDL.Null,
      createPair: IDL.Null,
      deposit: IDL.Null,
      removeLiquidity: IDL.Null,
      lpTransferFrom: IDL.Null,
      tokenTransferFrom: IDL.Null,
      tokenApprove: IDL.Null,
    });
    const TxRecord = IDL.Record({
      op: Operation,
      to: IDL.Principal,
      fee: IDL.Nat,
      tokenId: IDL.Text,
      from: IDL.Principal,
      amount0: IDL.Nat,
      amount1: IDL.Nat,
      timestamp: Time,
      caller: IDL.Principal,
      index: IDL.Nat,
      amount: IDL.Nat,
    });
    const Status = IDL.Record({
      memSize: IDL.Nat,
      storageId: IDL.Principal,
      cycles: IDL.Nat,
      start: IDL.Nat,
      length: IDL.Nat,
    });
    const Bucket = IDL.Service({
      addRecords: IDL.Func([IDL.Vec(TxRecord)], [IDL.Nat], []),
      getStatus: IDL.Func([], [Status], ['query']),
      getTransaction: IDL.Func([IDL.Nat], [TxRecord], ['query']),
      getTransactions: IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(TxRecord)],
        ['query']
      ),
    });
    const BucketInfoExt = IDL.Record({
      id: IDL.Nat,
      bucketId: IDL.Principal,
      start: IDL.Nat,
      length: IDL.Nat,
    });
    const Status__1 = IDL.Record({
      recordsPerBucket: IDL.Nat,
      memSize: IDL.Nat,
      owner: IDL.Principal,
      txAmount: IDL.Nat,
      cycles: IDL.Nat,
      flushing: IDL.Bool,
      bufferSize: IDL.Nat,
      chunkSize: IDL.Nat,
      dswap: IDL.Principal,
      buckets: IDL.Vec(BucketInfoExt),
    });
    const TxRecord__1 = IDL.Record({
      op: Operation,
      to: IDL.Principal,
      fee: IDL.Nat,
      tokenId: IDL.Text,
      from: IDL.Principal,
      amount0: IDL.Nat,
      amount1: IDL.Nat,
      timestamp: Time,
      caller: IDL.Principal,
      index: IDL.Nat,
      amount: IDL.Nat,
    });
    const Storage = IDL.Service({
      addRecord: IDL.Func(
        [
          IDL.Principal,
          Operation__1,
          IDL.Text,
          IDL.Principal,
          IDL.Principal,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          Time,
        ],
        [IDL.Nat],
        []
      ),
      flush: IDL.Func([], [IDL.Bool], []),
      getBucket: IDL.Func([], [Bucket], []),
      getStatus: IDL.Func([], [Status__1], ['query']),
      getTransaction: IDL.Func([IDL.Nat], [TxRecord__1], []),
      getTransactions: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(TxRecord__1)], []),
      getUserTransactionAmount: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
      getUserTransactions: IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Nat],
        [IDL.Vec(TxRecord__1)],
        []
      ),
      historySize: IDL.Func([], [IDL.Nat], []),
      newBucket: IDL.Func([], [Bucket], []),
      setDSwapCanisterId: IDL.Func([IDL.Principal], [IDL.Bool], []),
    });
    return Storage;
  };
}
