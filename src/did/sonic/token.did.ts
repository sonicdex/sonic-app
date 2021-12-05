import { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export namespace TokenIDL {
  export interface Metadata {
    fee: bigint;
    decimals: number;
    owner: Principal;
    logo: string;
    name: string;
    totalSupply: bigint;
    symbol: string;
  }
  export type Operation =
    | { transferFrom: null }
    | { mint: null }
    | { approve: null }
    | { transfer: null };
  export type Time = bigint;
  export interface Token {
    allowance: (arg_0: Principal, arg_1: Principal) => Promise<bigint>;
    approve: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
    balanceOf: (arg_0: Principal) => Promise<bigint>;
    decimals: () => Promise<number>;
    getAllowanceSize: () => Promise<bigint>;
    getHolders: (
      arg_0: bigint,
      arg_1: bigint
    ) => Promise<Array<[Principal, bigint]>>;
    getMetadata: () => Promise<Metadata>;
    getTokenInfo: () => Promise<TokenInfo>;
    getTransaction: (arg_0: bigint) => Promise<TxRecord>;
    getTransactions: (arg_0: bigint, arg_1: bigint) => Promise<Array<TxRecord>>;
    getUserApprovals: (arg_0: Principal) => Promise<Array<[Principal, bigint]>>;
    getUserTransactionAmount: (arg_0: Principal) => Promise<bigint>;
    getUserTransactions: (
      arg_0: Principal,
      arg_1: bigint,
      arg_2: bigint
    ) => Promise<Array<TxRecord>>;
    historySize: () => Promise<bigint>;
    logo: () => Promise<string>;
    name: () => Promise<string>;
    setFee: (arg_0: bigint) => Promise<undefined>;
    setFeeTo: (arg_0: Principal) => Promise<undefined>;
    setLogo: (arg_0: string) => Promise<undefined>;
    setOwner: (arg_0: Principal) => Promise<undefined>;
    symbol: () => Promise<string>;
    totalSupply: () => Promise<bigint>;
    transfer: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
    transferFrom: (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: bigint
    ) => Promise<TxReceipt>;
  }
  export interface TokenInfo {
    holderNumber: bigint;
    deployTime: Time;
    metadata: Metadata;
    historySize: bigint;
    cycles: bigint;
    feeTo: Principal;
  }
  export type TransactionStatus =
    | { inprogress: null }
    | { failed: null }
    | { succeeded: null };
  export type TxReceipt =
    | { ok: bigint }
    | {
        err: { InsufficientAllowance: null } | { InsufficientBalance: null };
      };
  export interface TxRecord {
    op: Operation;
    to: Principal;
    fee: bigint;
    status: TransactionStatus;
    from: Principal;
    timestamp: Time;
    caller: [] | [Principal];
    index: bigint;
    amount: bigint;
  }
  export interface Factory extends Token {}

  export const factory: IDL.InterfaceFactory = ({ IDL }) => {
    const TxReceipt = IDL.Variant({
      ok: IDL.Nat,
      err: IDL.Variant({
        InsufficientAllowance: IDL.Null,
        InsufficientBalance: IDL.Null,
      }),
    });
    const Metadata = IDL.Record({
      fee: IDL.Nat,
      decimals: IDL.Nat8,
      owner: IDL.Principal,
      logo: IDL.Text,
      name: IDL.Text,
      totalSupply: IDL.Nat,
      symbol: IDL.Text,
    });
    const Time = IDL.Int;
    const TokenInfo = IDL.Record({
      holderNumber: IDL.Nat,
      deployTime: Time,
      metadata: Metadata,
      historySize: IDL.Nat,
      cycles: IDL.Nat,
      feeTo: IDL.Principal,
    });
    const Operation = IDL.Variant({
      transferFrom: IDL.Null,
      mint: IDL.Null,
      approve: IDL.Null,
      transfer: IDL.Null,
    });
    const TxRecord = IDL.Record({
      op: Operation,
      to: IDL.Principal,
      fee: IDL.Nat,
      from: IDL.Principal,
      timestamp: Time,
      caller: IDL.Opt(IDL.Principal),
      index: IDL.Nat,
      amount: IDL.Nat,
    });
    const Token = IDL.Service({
      allowance: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Nat], ['query']),
      approve: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
      balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
      decimals: IDL.Func([], [IDL.Nat8], ['query']),
      getAllowanceSize: IDL.Func([], [IDL.Nat], ['query']),
      getHolders: IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query']
      ),
      getMetadata: IDL.Func([], [Metadata], ['query']),
      getTokenInfo: IDL.Func([], [TokenInfo], ['query']),
      getTransaction: IDL.Func([IDL.Nat], [TxRecord], ['query']),
      getTransactions: IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(TxRecord)],
        ['query']
      ),
      getUserApprovals: IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query']
      ),
      getUserTransactionAmount: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
      getUserTransactions: IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Nat],
        [IDL.Vec(TxRecord)],
        ['query']
      ),
      historySize: IDL.Func([], [IDL.Nat], ['query']),
      logo: IDL.Func([], [IDL.Text], ['query']),
      name: IDL.Func([], [IDL.Text], ['query']),
      setFee: IDL.Func([IDL.Nat], [IDL.Bool], []),
      setFeeTo: IDL.Func([IDL.Principal], [IDL.Bool], []),
      setLogo: IDL.Func([IDL.Text], [IDL.Bool], []),
      setOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
      symbol: IDL.Func([], [IDL.Text], ['query']),
      totalSupply: IDL.Func([], [IDL.Nat], ['query']),
      transfer: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
      transferFrom: IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TxReceipt],
        []
      ),
    });
    return Token;
  };
}
