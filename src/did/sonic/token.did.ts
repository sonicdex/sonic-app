import { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export namespace TokenIDL {
  export namespace DIP20 {
    export interface Metadata {
      fee: bigint;
      decimals: number;
      owner: Principal;
      logo: string;
      name: string;
      totalSupply: bigint;
      symbol: string;
    }
    export type Result = { Ok: bigint } | { Err: TxError };
    export type YCResult = { Ok: string } | { Err: TxError };
    export interface TokenInfo {
      holderNumber: bigint;
      deployTime: bigint;
      metadata: Metadata;
      historySize: bigint;
      cycles: bigint;
      feeTo: Principal;
    }
    export type TxError =
      | { InsufficientAllowance: null }
      | { InsufficientBalance: null }
      | { ErrorOperationStyle: null }
      | { Unauthorized: null }
      | { LedgerTrap: null }
      | { ErrorTo: null }
      | { Other: null }
      | { BlockUsed: null }
      | { AmountTooSmall: null };
    export interface Token {
      allowance: (arg_0: Principal, arg_1: Principal) => Promise<bigint>;
      approve: (arg_0: Principal, arg_1: bigint) => Promise<Result>;
      balanceOf: (arg_0: Principal) => Promise<bigint>;
      decimals: () => Promise<number>;
      getAllowanceSize: () => Promise<bigint>;
      getBlockUsed: () => Promise<Array<bigint>>;
      getHolders: (
        arg_0: bigint,
        arg_1: bigint
      ) => Promise<Array<[Principal, bigint]>>;
      logo: () => Promise<string>;
      getMetadata: () => Promise<Metadata>;
      getTokenInfo: () => Promise<TokenInfo>;
      getUserApprovals: (arg_0: Principal) => Promise<Array<[Principal, bigint]>>;
      historySize: () => Promise<bigint>;
      isBlockUsed: (arg_0: bigint) => Promise<boolean>;
      mint: (arg_0: [] | [Array<number>], arg_1: bigint) => Promise<Result>;
      name: () => Promise<string>;
      owner: () => Promise<Principal>;
      setFee: (arg_0: bigint) => Promise<undefined>;
      setFeeTo: (arg_0: Principal) => Promise<undefined>;
      setGenesis: () => Promise<Result>;
      setLogo: (arg_0: string) => Promise<undefined>;
      setName: (arg_0: string) => Promise<undefined>;
      setOwner: (arg_0: Principal) => Promise<undefined>;
      symbol: () => Promise<string>;
      totalSupply: () => Promise<bigint>;
      transfer: (arg_0: Principal, arg_1: bigint) => Promise<Result>;
      transferFrom: (
        arg_0: Principal,
        arg_1: Principal,
        arg_2: bigint
      ) => Promise<Result>;
      withdraw: (arg_0: bigint, arg_1: string) => Promise<Result>;
    }
    export type Factory = Token;

    export const factory: IDL.InterfaceFactory = ({ IDL }) => {
      const TxError = IDL.Variant({
        InsufficientAllowance: IDL.Null,
        InsufficientBalance: IDL.Null,
        ErrorOperationStyle: IDL.Null,
        Unauthorized: IDL.Null,
        LedgerTrap: IDL.Null,
        ErrorTo: IDL.Null,
        Other: IDL.Null,
        BlockUsed: IDL.Null,
        AmountTooSmall: IDL.Null,
      });
      const Result = IDL.Variant({ Ok: IDL.Nat, Err: TxError });
      const Metadata = IDL.Record({
        fee: IDL.Nat,
        decimals: IDL.Nat8,
        owner: IDL.Principal,
        logo: IDL.Text,
        name: IDL.Text,
        totalSupply: IDL.Nat,
        symbol: IDL.Text,
      });
      const TokenInfo = IDL.Record({
        holderNumber: IDL.Nat64,
        deployTime: IDL.Nat64,
        metadata: Metadata,
        historySize: IDL.Nat64,
        cycles: IDL.Nat64,
        feeTo: IDL.Principal,
      });
      return IDL.Service({
        allowance: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Nat], ['query']),
        approve: IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
        balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], []),
        decimals: IDL.Func([], [IDL.Nat8], ['query']),
        getAllowanceSize: IDL.Func([], [IDL.Nat64], ['query']),
        getBlockUsed: IDL.Func([], [IDL.Vec(IDL.Nat64)], ['query']),
        getHolders: IDL.Func(
          [IDL.Nat64, IDL.Nat64],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
          ['query']
        ),
        logo: IDL.Func([], [IDL.Text], ['query']),
        getMetadata: IDL.Func([], [Metadata], ['query']),
        getTokenInfo: IDL.Func([], [TokenInfo], ['query']),
        getUserApprovals: IDL.Func(
          [IDL.Principal],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
          ['query']
        ),
        historySize: IDL.Func([], [IDL.Nat64], ['query']),
        isBlockUsed: IDL.Func([IDL.Nat64], [IDL.Bool], ['query']),
        mint: IDL.Func([IDL.Opt(IDL.Vec(IDL.Nat8)), IDL.Nat64], [Result], []),
        name: IDL.Func([], [IDL.Text], ['query']),
        owner: IDL.Func([], [IDL.Principal], ['query']),
        setFee: IDL.Func([IDL.Nat], [], []),
        setFeeTo: IDL.Func([IDL.Principal], [], []),
        setGenesis: IDL.Func([], [Result], []),
        setLogo: IDL.Func([IDL.Text], [], []),
        setName: IDL.Func([IDL.Text], [], []),
        setOwner: IDL.Func([IDL.Principal], [], []),
        symbol: IDL.Func([], [IDL.Text], ['query']),
        totalSupply: IDL.Func([], [IDL.Nat], ['query']),
        transfer: IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
        transferFrom: IDL.Func(
          [IDL.Principal, IDL.Principal, IDL.Nat],
          [Result],
          []
        ),
        withdraw: IDL.Func([IDL.Nat64, IDL.Text], [Result], []),
      });
    };
    export const YCfactory: IDL.InterfaceFactory = ({ IDL }) => {
      const TxError = IDL.Variant({
        InsufficientAllowance: IDL.Null,
        InsufficientBalance: IDL.Null,
        ErrorOperationStyle: IDL.Null,
        Unauthorized: IDL.Null,
        LedgerTrap: IDL.Null,
        ErrorTo: IDL.Null,
        Other: IDL.Null,
        BlockUsed: IDL.Null,
        AmountTooSmall: IDL.Null,
      });
      const Result = IDL.Variant({ Ok: IDL.Text, Err: TxError });
      const Metadata = IDL.Record({
        fee: IDL.Nat,
        decimals: IDL.Nat8,
        owner: IDL.Principal,
        logo: IDL.Text,
        name: IDL.Text,
        totalSupply: IDL.Nat,
        symbol: IDL.Text,
      });
      const TokenInfo = IDL.Record({
        holderNumber: IDL.Nat64,
        deployTime: IDL.Nat64,
        metadata: Metadata,
        historySize: IDL.Nat64,
        cycles: IDL.Nat64,
        feeTo: IDL.Principal,
      });
      return IDL.Service({
        allowance: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Nat], ['query']),
        approve: IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
        balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], []),
        decimals: IDL.Func([], [IDL.Nat8], ['query']),
        getAllowanceSize: IDL.Func([], [IDL.Nat64], ['query']),
        getBlockUsed: IDL.Func([], [IDL.Vec(IDL.Nat64)], ['query']),
        getHolders: IDL.Func(
          [IDL.Nat64, IDL.Nat64],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
          ['query']
        ),
        logo: IDL.Func([], [IDL.Text], ['query']),
        getMetadata: IDL.Func([], [Metadata], ['query']),
        getTokenInfo: IDL.Func([], [TokenInfo], ['query']),
        getUserApprovals: IDL.Func(
          [IDL.Principal],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
          ['query']
        ),
        historySize: IDL.Func([], [IDL.Nat64], ['query']),
        isBlockUsed: IDL.Func([IDL.Nat64], [IDL.Bool], ['query']),
        mint: IDL.Func([IDL.Opt(IDL.Vec(IDL.Nat8)), IDL.Nat64], [Result], []),
        name: IDL.Func([], [IDL.Text], ['query']),
        owner: IDL.Func([], [IDL.Principal], ['query']),
        setFee: IDL.Func([IDL.Nat], [], []),
        setFeeTo: IDL.Func([IDL.Principal], [], []),
        setGenesis: IDL.Func([], [Result], []),
        setLogo: IDL.Func([IDL.Text], [], []),
        setName: IDL.Func([IDL.Text], [], []),
        setOwner: IDL.Func([IDL.Principal], [], []),
        symbol: IDL.Func([], [IDL.Text], ['query']),
        totalSupply: IDL.Func([], [IDL.Nat], ['query']),
        transfer: IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
        transferFrom: IDL.Func(
          [IDL.Principal, IDL.Principal, IDL.Nat],
          [Result],
          []
        ),
        withdraw: IDL.Func([IDL.Nat64, IDL.Text], [Result], []),
      });
    };
  };

  export namespace ICRC1 {
    export interface Account { owner: Principal, subaccount: [] | [Array<number>] };
    export interface ArchivedTransactionRange { callback: [Principal, string], start: bigint, length: bigint };
    export interface Burn { from: Account, memo: [] | [Array<number>], created_at_time: [] | [bigint], amount: bigint };
    export interface GetTransactionsRequest { start: bigint, length: bigint };
    export interface GetTransactionsResponse {
      first_index: bigint, log_length: bigint, transactions: Array<Transaction>,
      archived_transactions: Array<ArchivedTransactionRange>,
    };
    export interface HttpRequest { url: string, method: string, body: Array<number>, headers: Array<[string, string]> };
    export interface HttpResponse { body: Array<number>, headers: Array<[string, string]>, status_code: number };
    export interface Mint { to: Account, memo: [] | [Array<number>], created_at_time: [] | [bigint], amount: bigint };
    export type Result = { Ok: bigint } | { Err: TransferError };
    export interface StandardRecord { url: string, name: string };
    export interface Transaction {
      burn: [] | [Burn], kind: string, mint: [] | [Mint],
      timestamp: bigint, transfer: [] | [Transfer]
    };
    export interface Transfer {
      to: Account, fee: [] | [bigint], from: Account, memo: [] | [Array<number>],
      created_at_time: [] | [bigint], amount: bigint,
    };
    export interface TransferArg {
      to: Account, fee: [] | [bigint], memo: [] | [Array<number>],
      from_subaccount: [] | [Array<number>], created_at_time: [] | [bigint], amount: bigint
    };
    export type TransferError = {
      GenericError: { message: string, error_code: bigint }
    } |
    { TemporarilyUnavailable: null } |
    { BadBurn: { min_burn_amount: bigint } } |
    { Duplicate: { duplicate_of: bigint } } |
    { BadFee: { expected_fee: bigint } } |
    { CreatedInFuture: { ledger_time: bigint } } |
    { TooOld: null } |
    { InsufficientFunds: { balance: bigint } };
    export type TransferError_1 = { TxTooOld : { allowed_window_nanos : bigint }} |
    { BadFee : { expected_fee : Tokens } } | { TxDuplicate : { duplicate_of : bigint } } | { TxCreatedInFuture : null } |
    { InsufficientFunds : { balance : Tokens } };
    
    export type Value = { Int: bigint } | { Nat: bigint } | { Blob: Array<number> } | { Text: string };
    export interface Tokens { 'e8s' : bigint };
    export interface TimeStamp { 'timestamp_nanos' : bigint };
    export type Result_1 = { 'Ok' : bigint } |{ 'Err' : TransferError_1 };
    export interface TransferArgs {
      to : Array<number>, fee : Tokens, memo : bigint,from_subaccount : [] | [Array<number>],
      created_at_time : [] | [TimeStamp], amount : Tokens,
    };
    export interface Token {
      get_transactions: (arg_0: GetTransactionsRequest) => Promise<GetTransactionsResponse>,
      http_request: (arg_0: HttpRequest) => Promise<HttpResponse>,
      icrc1_balance_of: (arg_0: Account) => Promise<bigint>,
      icrc1_decimals: () => Promise<number>,
      icrc1_fee: () => Promise<bigint>,
      icrc1_metadata: () => Promise<Array<[string, Value]>>,
      icrc1_minting_account: () => Promise<[] | [Account]>,
      icrc1_name: () => Promise<string>,
      icrc1_supported_standards: () => Promise<Array<StandardRecord>>,
      icrc1_symbol: () => Promise<string>,
      icrc1_total_supply: () => Promise<bigint>,
      icrc1_transfer: (arg_0: TransferArg) => Promise<Result>,
      transfer : (arg_0: TransferArgs) => Promise<Result_1>,
    };
    export type Factory = Token;
    export const factory: IDL.InterfaceFactory = ({ IDL }) => {
      const GetTransactionsRequest = IDL.Record({ start: IDL.Nat, length: IDL.Nat });
      const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) });
      const Burn = IDL.Record({
        from: Account, memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64), amount: IDL.Nat
      });
      const Mint = IDL.Record({
        to: Account, memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64), amount: IDL.Nat
      });
      const Transfer = IDL.Record({
        to: Account, fee: IDL.Opt(IDL.Nat), from: Account, memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time: IDL.Opt(IDL.Nat64), amount: IDL.Nat,
      });
      const Transaction = IDL.Record({
        burn: IDL.Opt(Burn), kind: IDL.Text, mint: IDL.Opt(Mint), timestamp: IDL.Nat64,
        transfer: IDL.Opt(Transfer),
      });
      const ArchivedTransactionRange = IDL.Record({
        callback: IDL.Func( [GetTransactionsRequest],
          [IDL.Record({ transactions: IDL.Vec(Transaction) })],['query'],
        ),
        start: IDL.Nat, length: IDL.Nat,
      });

      const GetTransactionsResponse = IDL.Record({ 
        first_index: IDL.Nat, log_length: IDL.Nat, transactions: IDL.Vec(Transaction),
        archived_transactions: IDL.Vec(ArchivedTransactionRange),
      });
      const HttpRequest = IDL.Record({
        url: IDL.Text, method: IDL.Text,body: IDL.Vec(IDL.Nat8), headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
      });
      const HttpResponse = IDL.Record({
        body: IDL.Vec(IDL.Nat8), headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)), status_code: IDL.Nat16,
      });
      const Value = IDL.Variant({ Int: IDL.Int, Nat: IDL.Nat, Blob: IDL.Vec(IDL.Nat8), Text: IDL.Text});
      const StandardRecord = IDL.Record({ url: IDL.Text, name: IDL.Text });

      const TransferArg = IDL.Record({
        to: Account, fee: IDL.Opt(IDL.Nat), memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
        from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),created_at_time: IDL.Opt(IDL.Nat64), amount: IDL.Nat,
      });
       
      const TransferError = IDL.Variant({
        GenericError: IDL.Record({  message: IDL.Text,   error_code: IDL.Nat }),
        TemporarilyUnavailable: IDL.Null,
        BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
        Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
        BadFee: IDL.Record({ expected_fee: IDL.Nat }),
        CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
        TooOld: IDL.Null,
        InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
      });
      
      const Tokens = IDL.Record({ e8s : IDL.Nat64 });
      const TimeStamp = IDL.Record({ timestamp_nanos : IDL.Nat64 });

      const TransferError_1 = IDL.Variant({
        TxTooOld : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
        BadFee : IDL.Record({ 'expected_fee' : Tokens }),
        TxDuplicate : IDL.Record({ 'duplicate_of' : IDL.Nat64 }),
        TxCreatedInFuture : IDL.Null,
        InsufficientFunds : IDL.Record({ 'balance' : Tokens }),
      });

      const Result_1 = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : TransferError_1 });

      const TransferArgs = IDL.Record({
        to : IDL.Vec(IDL.Nat8),
        fee : Tokens,
        memo : IDL.Nat64,
        from_subaccount : IDL.Opt(IDL.Vec(IDL.Nat8)),
        created_at_time : IDL.Opt(TimeStamp),
        amount : Tokens,
      });
      
      const Result = IDL.Variant({ Ok: IDL.Nat, Err: TransferError });
      return IDL.Service({
        get_transactions: IDL.Func( [GetTransactionsRequest], [GetTransactionsResponse],['query']),
        http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
        icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ['query']),
        icrc1_decimals: IDL.Func([], [IDL.Nat8], ['query']),
        icrc1_fee: IDL.Func([], [IDL.Nat], ['query']),
        icrc1_metadata: IDL.Func( [], [IDL.Vec(IDL.Tuple(IDL.Text, Value))],['query'] ),
        icrc1_minting_account: IDL.Func([], [IDL.Opt(Account)], ['query']),
        icrc1_name: IDL.Func([], [IDL.Text], ['query']),
        icrc1_supported_standards: IDL.Func( [],[IDL.Vec(StandardRecord)],['query']),
        icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
        icrc1_total_supply: IDL.Func([], [IDL.Nat], ['query']),
        icrc1_transfer: IDL.Func([TransferArg], [Result], []),
        transfer : IDL.Func([TransferArgs], [Result_1], []),
      });
    }
  }

  export namespace ICRC2 {

    
  }
  export const SNEED: IDL.InterfaceFactory = ({ IDL }) =>{
    const ArchiveInterface__1 = IDL.Rec();
    const Subaccount = IDL.Vec(IDL.Nat8);
    const Balance = IDL.Nat;
    const BurnArgs = IDL.Record({
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'from_subaccount' : IDL.Opt(Subaccount),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const TxIndex = IDL.Nat;
    const Timestamp = IDL.Nat64;
    const TransferError = IDL.Variant({
      'GenericError' : IDL.Record({
        'message' : IDL.Text,
        'error_code' : IDL.Nat,
      }),
      'TemporarilyUnavailable' : IDL.Null,
      'BadBurn' : IDL.Record({ 'min_burn_amount' : Balance }),
      'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
      'BadFee' : IDL.Record({ 'expected_fee' : Balance }),
      'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
      'TooOld' : IDL.Null,
      'InsufficientFunds' : IDL.Record({ 'balance' : Balance }),
    });
    const TransferResult = IDL.Variant({ 'Ok' : TxIndex, 'Err' : TransferError });
    const Account = IDL.Record({
      'owner' : IDL.Principal,
      'subaccount' : IDL.Opt(Subaccount),
    });
    const Burn = IDL.Record({
      'from' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const Mint__1 = IDL.Record({
      'to' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const Transfer = IDL.Record({
      'to' : Account,
      'fee' : IDL.Opt(Balance),
      'from' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const Transaction = IDL.Record({
      'burn' : IDL.Opt(Burn),
      'kind' : IDL.Text,
      'mint' : IDL.Opt(Mint__1),
      'timestamp' : Timestamp,
      'index' : TxIndex,
      'transfer' : IDL.Opt(Transfer),
    });
    const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
    const GetTransactionsRequest__1 = IDL.Record({
      'start' : TxIndex,
      'length' : IDL.Nat,
    });
    const TransactionRange = IDL.Record({
      'transactions' : IDL.Vec(Transaction),
    });
    ArchiveInterface__1.fill(
      IDL.Service({
        'append_transactions' : IDL.Func([IDL.Vec(Transaction)], [Result], []),
        'get_first_tx' : IDL.Func([], [IDL.Nat], ['query']),
        'get_last_tx' : IDL.Func([], [IDL.Nat], ['query']),
        'get_next_archive' : IDL.Func([], [ArchiveInterface__1], ['query']),
        'get_prev_archive' : IDL.Func([], [ArchiveInterface__1], ['query']),
        'get_transaction' : IDL.Func(
            [TxIndex],
            [IDL.Opt(Transaction)],
            ['query'],
          ),
        'get_transactions' : IDL.Func(
            [GetTransactionsRequest__1],
            [TransactionRange],
            ['query'],
          ),
        'max_memory' : IDL.Func([], [IDL.Nat], ['query']),
        'remaining_capacity' : IDL.Func([], [IDL.Nat], ['query']),
        'set_first_tx' : IDL.Func([IDL.Nat], [Result], []),
        'set_last_tx' : IDL.Func([IDL.Nat], [Result], []),
        'set_next_archive' : IDL.Func([ArchiveInterface__1], [Result], []),
        'set_prev_archive' : IDL.Func([ArchiveInterface__1], [Result], []),
        'total_transactions' : IDL.Func([], [IDL.Nat], ['query']),
        'total_used' : IDL.Func([], [IDL.Nat], ['query']),
      })
    );
    const ArchiveInterface = IDL.Service({
      'append_transactions' : IDL.Func([IDL.Vec(Transaction)], [Result], []),
      'get_first_tx' : IDL.Func([], [IDL.Nat], ['query']),
      'get_last_tx' : IDL.Func([], [IDL.Nat], ['query']),
      'get_next_archive' : IDL.Func([], [ArchiveInterface__1], ['query']),
      'get_prev_archive' : IDL.Func([], [ArchiveInterface__1], ['query']),
      'get_transaction' : IDL.Func([TxIndex], [IDL.Opt(Transaction)], ['query']),
      'get_transactions' : IDL.Func(
          [GetTransactionsRequest__1],
          [TransactionRange],
          ['query'],
        ),
      'max_memory' : IDL.Func([], [IDL.Nat], ['query']),
      'remaining_capacity' : IDL.Func([], [IDL.Nat], ['query']),
      'set_first_tx' : IDL.Func([IDL.Nat], [Result], []),
      'set_last_tx' : IDL.Func([IDL.Nat], [Result], []),
      'set_next_archive' : IDL.Func([ArchiveInterface__1], [Result], []),
      'set_prev_archive' : IDL.Func([ArchiveInterface__1], [Result], []),
      'total_transactions' : IDL.Func([], [IDL.Nat], ['query']),
      'total_used' : IDL.Func([], [IDL.Nat], ['query']),
    });
    const TxIndex__1 = IDL.Nat;
    const Transaction__1 = IDL.Record({
      'burn' : IDL.Opt(Burn),
      'kind' : IDL.Text,
      'mint' : IDL.Opt(Mint__1),
      'timestamp' : Timestamp,
      'index' : TxIndex,
      'transfer' : IDL.Opt(Transfer),
    });
    const GetTransactionsRequest = IDL.Record({
      'start' : TxIndex,
      'length' : IDL.Nat,
    });
    const QueryArchiveFn = IDL.Func(
        [GetTransactionsRequest__1],
        [TransactionRange],
        ['query'],
      );
    const ArchivedTransaction = IDL.Record({
      'callback' : QueryArchiveFn,
      'start' : TxIndex,
      'length' : IDL.Nat,
    });
    const GetTransactionsResponse = IDL.Record({
      'first_index' : TxIndex,
      'log_length' : IDL.Nat,
      'transactions' : IDL.Vec(Transaction),
      'archived_transactions' : IDL.Vec(ArchivedTransaction),
    });
    const Account__1 = IDL.Record({
      'owner' : IDL.Principal,
      'subaccount' : IDL.Opt(Subaccount),
    });
    const Balance__1 = IDL.Nat;
    const Value = IDL.Variant({
      'Int' : IDL.Int,
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
    });
    const MetaDatum = IDL.Tuple(IDL.Text, Value);
    const SupportedStandard = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
    const TransferArgs = IDL.Record({
      'to' : Account,
      'fee' : IDL.Opt(Balance),
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'from_subaccount' : IDL.Opt(Subaccount),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const Mint = IDL.Record({
      'to' : Account,
      'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'created_at_time' : IDL.Opt(IDL.Nat64),
      'amount' : Balance,
    });
    const SetParameterError = IDL.Variant({
      'GenericError' : IDL.Record({
        'message' : IDL.Text,
        'error_code' : IDL.Nat,
      }),
    });
    const SetNat8ParameterResult = IDL.Variant({
      'Ok' : IDL.Nat8,
      'Err' : SetParameterError,
    });
    const SetBalanceParameterResult = IDL.Variant({
      'Ok' : Balance,
      'Err' : SetParameterError,
    });
    const SetTextParameterResult = IDL.Variant({
      'Ok' : IDL.Text,
      'Err' : SetParameterError,
    });
    const SetAccountParameterResult = IDL.Variant({
      'Ok' : Account,
      'Err' : SetParameterError,
    });
    return IDL.Service({
      'burn' : IDL.Func([BurnArgs], [TransferResult], []),
      'deposit_cycles' : IDL.Func([], [], []),
      'get_archive' : IDL.Func([], [ArchiveInterface], ['query']),
      'get_archive_stored_txs' : IDL.Func([], [IDL.Nat], ['query']),
      'get_total_tx' : IDL.Func([], [IDL.Nat], ['query']),
      'get_transaction' : IDL.Func([TxIndex__1], [IDL.Opt(Transaction__1)], []),
      'get_transactions' : IDL.Func(
          [GetTransactionsRequest],
          [GetTransactionsResponse],
          ['query'],
        ),
      'icrc1_balance_of' : IDL.Func([Account__1], [Balance__1], ['query']),
      'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
      'icrc1_fee' : IDL.Func([], [Balance__1], ['query']),
      'icrc1_metadata' : IDL.Func([], [IDL.Vec(MetaDatum)], ['query']),
      'icrc1_minting_account' : IDL.Func([], [IDL.Opt(Account__1)], ['query']),
      'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
      'icrc1_supported_standards' : IDL.Func(
          [],
          [IDL.Vec(SupportedStandard)],
          ['query'],
        ),
      'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
      'icrc1_total_supply' : IDL.Func([], [Balance__1], ['query']),
      'icrc1_transfer' : IDL.Func([TransferArgs], [TransferResult], []),
      'min_burn_amount' : IDL.Func([], [Balance__1], ['query']),
      'mint' : IDL.Func([Mint], [TransferResult], []),
      'set_decimals' : IDL.Func([IDL.Nat8], [SetNat8ParameterResult], []),
      'set_fee' : IDL.Func([Balance__1], [SetBalanceParameterResult], []),
      'set_logo' : IDL.Func([IDL.Text], [SetTextParameterResult], []),
      'set_min_burn_amount' : IDL.Func(
          [Balance__1],
          [SetBalanceParameterResult],
          [],
        ),
      'set_minting_account' : IDL.Func(
          [IDL.Text],
          [SetAccountParameterResult],
          [],
        ),
      'set_name' : IDL.Func([IDL.Text], [SetTextParameterResult], []),
      'set_symbol' : IDL.Func([IDL.Text], [SetTextParameterResult], []),
    });
  };


}


