import { Principal } from '@dfinity/principal';

export namespace LedgerIDL {
  export interface AccountBalanceArgs {
    account: AccountIdentifier;
  }
  export type AccountIdentifier = string;
  export interface ArchiveOptions {
    max_message_size_bytes: [] | [number];
    node_max_memory_size_bytes: [] | [number];
    controller_id: Principal;
  }
  export type BlockHeight = bigint;
  export interface Duration {
    secs: bigint;
    nanos: number;
  }
  export interface ICPTs {
    e8s: bigint;
  }
  export interface LedgerCanisterInitPayload {
    send_whitelist: Array<[Principal]>;
    minting_account: AccountIdentifier;
    transaction_window: [] | [Duration];
    max_message_size_bytes: [] | [number];
    archive_options: [] | [ArchiveOptions];
    initial_values: Array<[AccountIdentifier, ICPTs]>;
  }
  export type Memo = bigint;
  export interface NotifyCanisterArgs {
    to_subaccount: [] | [SubAccount];
    from_subaccount: [] | [SubAccount];
    to_canister: Principal;
    max_fee: ICPTs;
    block_height: BlockHeight;
  }
  export interface SendArgs {
    to: AccountIdentifier;
    fee: ICPTs;
    memo: Memo;
    from_subaccount: [] | [SubAccount];
    created_at_time: [] | [TimeStamp];
    amount: ICPTs;
  }
  export type SubAccount = Array<number>;
  export interface TimeStamp {
    timestamp_nanos: bigint;
  }
  export interface Transaction {
    memo: Memo;
    created_at: BlockHeight;
    transfer: Transfer;
  }
  export type Transfer =
    | {
        Burn: { from: AccountIdentifier; amount: ICPTs };
      }
    | { Mint: { to: AccountIdentifier; amount: ICPTs } }
    | {
        Send: {
          to: AccountIdentifier;
          from: AccountIdentifier;
          amount: ICPTs;
        };
      };
  export interface Factory {
    account_balance_dfx: (arg_0: AccountBalanceArgs) => Promise<ICPTs>;
    notify_dfx: (arg_0: NotifyCanisterArgs) => Promise<undefined>;
    send_dfx: (arg_0: SendArgs) => Promise<BlockHeight>;
  }

  export const factory = ({ IDL }) => {
    const AccountIdentifier = IDL.Text;
    const Duration = IDL.Record({ secs: IDL.Nat64, nanos: IDL.Nat32 });
    const ArchiveOptions = IDL.Record({
      max_message_size_bytes: IDL.Opt(IDL.Nat32),
      node_max_memory_size_bytes: IDL.Opt(IDL.Nat32),
      controller_id: IDL.Principal,
    });
    const ICPTs = IDL.Record({ e8s: IDL.Nat64 });
    const LedgerCanisterInitPayload = IDL.Record({
      send_whitelist: IDL.Vec(IDL.Tuple(IDL.Principal)),
      minting_account: AccountIdentifier,
      transaction_window: IDL.Opt(Duration),
      max_message_size_bytes: IDL.Opt(IDL.Nat32),
      archive_options: IDL.Opt(ArchiveOptions),
      initial_values: IDL.Vec(IDL.Tuple(AccountIdentifier, ICPTs)),
    });
    const AccountBalanceArgs = IDL.Record({ account: AccountIdentifier });
    const SubAccount = IDL.Vec(IDL.Nat8);
    const BlockHeight = IDL.Nat64;
    const NotifyCanisterArgs = IDL.Record({
      to_subaccount: IDL.Opt(SubAccount),
      from_subaccount: IDL.Opt(SubAccount),
      to_canister: IDL.Principal,
      max_fee: ICPTs,
      block_height: BlockHeight,
    });
    const Memo = IDL.Nat64;
    const TimeStamp = IDL.Record({ timestamp_nanos: IDL.Nat64 });
    const SendArgs = IDL.Record({
      to: AccountIdentifier,
      fee: ICPTs,
      memo: Memo,
      from_subaccount: IDL.Opt(SubAccount),
      created_at_time: IDL.Opt(TimeStamp),
      amount: ICPTs,
    });
    return IDL.Service({
      account_balance_dfx: IDL.Func([AccountBalanceArgs], [ICPTs], ['query']),
      notify_dfx: IDL.Func([NotifyCanisterArgs], [], []),
      send_dfx: IDL.Func([SendArgs], [BlockHeight], []),
    });
  };
}
