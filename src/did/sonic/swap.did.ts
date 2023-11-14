import { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export namespace SwapIDL {
  export interface CanisterSettings {
    'freezing_threshold' : [] | [bigint],
    'controllers' : [] | [Array<Principal>],
    'memory_allocation' : [] | [bigint],
    'compute_allocation' : [] | [bigint],
  };
  export interface CanisterStatus {
    'status' : Status,
    'memory_size' : bigint,
    'cycles' : bigint,
    'settings' : CanisterSettings,
    'module_hash' : [] | [Array<number>],
  };
  export interface CapDetails {
    'CapV2RootBucketId' : [] | [string],
    'CapV1Status' : boolean,
    'CapV2Status' : boolean,
    'CapV1RootBucketId' : [] | [string],
  };
  export interface DepositSubAccounts {
    'depositAId' : string,
    'subaccount' : Array<number>,
    'created_at' : Time,
    'transactionOwner' : Principal,
  };
  export type ICRC1SubAccountBalance = { 'ok' : bigint } |
    { 'err' : string };
  export type ICRCTxReceipt = { 'Ok' : Array<number> } |
    { 'Err' : string };
  export interface MonitorMetrics {
    'tokenBalancesSize' : bigint,
    'canisterStatus' : CanisterStatus,
    'blocklistedUsersCount' : bigint,
    'rewardTokensSize' : bigint,
    'lptokensSize' : bigint,
    'cycles' : bigint,
    'tokenAllowanceSize' : bigint,
    'rewardInfo' : bigint,
    'lpTokenAllowanceSize' : bigint,
    'rewardPairsSize' : bigint,
    'tokenCount' : bigint,
    'lpTokenBalancesSize' : bigint,
    'pairsCount' : bigint,
    'depositTransactionSize' : bigint,
  };
  export interface PairInfoExt {
    'id' : string,
    'price0CumulativeLast' : bigint,
    'creator' : Principal,
    'reserve0' : bigint,
    'reserve1' : bigint,
    'lptoken' : string,
    'totalSupply' : bigint,
    'token0' : string,
    'token1' : string,
    'price1CumulativeLast' : bigint,
    'kLast' : bigint,
    'blockTimestampLast' : bigint,
  };
  export type Result = { 'ok' : boolean } |
    { 'err' : string };
  export type Result_1 = { 'ok' : [bigint, bigint] } |
    { 'err' : string };
  export interface RewardInfo { 'tokenId' : string, 'amount' : bigint };
  export type Status = { 'stopped' : null } |
    { 'stopping' : null } |
    { 'running' : null };
  export interface SwapInfo {
    'owner' : Principal,
    'cycles' : bigint,
    'tokens' : Array<TokenInfoExt>,
    'pairs' : Array<PairInfoExt>,
    'feeOn' : boolean,
    'feeTo' : Principal,
  };
  export interface SwapInfoExt {
    'owner' : Principal,
    'txcounter' : bigint,
    'depositCounter' : bigint,
    'feeOn' : boolean,
    'feeTo' : Principal,
  };
  export type SwapLastTransaction = {
      'RemoveLiquidityOutAmount' : [bigint, bigint]
    } |
    { 'SwapOutAmount' : bigint } |
    { 'NotFound' : boolean };
  export type Time = bigint;
  export interface TokenAnalyticsInfo {
    'fee' : bigint,
    'decimals' : number,
    'name' : string,
    'totalSupply' : bigint,
    'symbol' : string,
  };
  export interface TokenInfoExt {
    'id' : string,
    'fee' : bigint,
    'decimals' : number,
    'name' : string,
    'totalSupply' : bigint,
    'symbol' : string,
  };
  export interface TokenInfoWithType {
    'id' : string,
    'fee' : bigint,
    'decimals' : number,
    'name' : string,
    'totalSupply' : bigint,
    'tokenType' : string,
    'symbol' : string,
  };
  export type TxReceipt = { 'ok' : bigint } |
    { 'err' : string };
  export interface UserInfo {
    'lpBalances' : Array<[string, bigint]>,
    'balances' : Array<[string, bigint]>,
  };
  export interface UserInfoPage {
    'lpBalances' : [Array<[string, bigint]>, bigint],
    'balances' : [Array<[string, bigint]>, bigint],
  };
  export type WithdrawRefundReceipt = { 'Ok' : boolean } |
    { 'Err' : string };
  export interface WithdrawState {
    'tokenId' : string,
    'refundStatus' : boolean,
    'value' : bigint,
    'userPId' : Principal,
  };

  // ---------------------------------------------

  export interface Swap {
    'addAuth' : (arg_0: Principal) => Promise<boolean>,
  'addLiquidity' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: bigint,
      arg_3: bigint,
      arg_4: bigint,
      arg_5: bigint,
      arg_6: bigint,
    ) => Promise<TxReceipt>,
  'addLiquidityForUser' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
      arg_3: bigint,
      arg_4: bigint,
    ) => Promise<TxReceipt>,
  'addLiquidityForUserTest' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
      arg_3: bigint,
      arg_4: bigint,
    ) => Promise<string>,
  'addToken' : (arg_0: Principal, arg_1: string) => Promise<TxReceipt>,
  'addUserToBlocklist' : (arg_0: Principal) => Promise<boolean>,
  'allowance' : (arg_0: string, arg_1: Principal, arg_2: Principal) => Promise<
      bigint
    >,
  'approve' : (arg_0: string, arg_1: Principal, arg_2: bigint) => Promise<
      boolean
    >,
  'balanceOf' : (arg_0: string, arg_1: Principal) => Promise<bigint>,
  'burn' : (arg_0: string, arg_1: bigint) => Promise<boolean>,
  'createPair' : (arg_0: Principal, arg_1: Principal) => Promise<TxReceipt>,
  'decimals' : (arg_0: string) => Promise<number>,
  'deposit' : (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>,
  'depositTo' : (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<
      TxReceipt
    >,
  'exportBalances' : (arg_0: string) => Promise<
      [] | [Array<[Principal, bigint]>]
    >,
  'exportFaileWithdraws' : () => Promise<Array<[string, WithdrawState]>>,
  'exportLPTokens' : () => Promise<Array<TokenInfoExt>>,
  'exportPairs' : () => Promise<Array<PairInfoExt>>,
  'exportRewardInfo' : () => Promise<Array<[Principal, Array<RewardInfo>]>>,
  'exportRewardPairs' : () => Promise<Array<PairInfoExt>>,
  'exportSubAccounts' : () => Promise<Array<[Principal, DepositSubAccounts]>>,
  'exportSwapInfo' : () => Promise<SwapInfoExt>,
  'exportTokenTypes' : () => Promise<Array<[string, string]>>,
  'exportTokens' : () => Promise<Array<TokenInfoExt>>,
  'failedWithdrawRefund' : (arg_0: string) => Promise<WithdrawRefundReceipt>,
  'getAllPairs' : () => Promise<Array<PairInfoExt>>,
  'getAllRewardPairs' : () => Promise<Array<PairInfoExt>>,
  'getAuthList' : () => Promise<Array<[Principal, boolean]>>,
  'getBlocklistedUsers' : () => Promise<Array<[Principal, boolean]>>,
  'getCapDetails' : () => Promise<CapDetails>,
  'getHolders' : (arg_0: string) => Promise<bigint>,
  'getICRC1SubAccountBalance' : (arg_0: Principal, arg_1: string) => Promise<
      ICRC1SubAccountBalance
    >,
  'getLPTokenId' : (arg_0: Principal, arg_1: Principal) => Promise<string>,
  'getLastTransactionOutAmount' : () => Promise<SwapLastTransaction>,
  'getNumPairs' : () => Promise<bigint>,
  'getPair' : (arg_0: Principal, arg_1: Principal) => Promise<
      [] | [PairInfoExt]
    >,
  'getPairs' : (arg_0: bigint, arg_1: bigint) => Promise<
      [Array<PairInfoExt>, bigint]
    >,
  'getSupportedTokenList' : () => Promise<Array<TokenInfoWithType>>,
  'getSupportedTokenListByName' : (
      arg_0: string,
      arg_1: bigint,
      arg_2: bigint,
    ) => Promise<[Array<TokenInfoExt>, bigint]>,
  'getSupportedTokenListSome' : (arg_0: bigint, arg_1: bigint) => Promise<
      [Array<TokenInfoExt>, bigint]
    >,
  'getSwapInfo' : () => Promise<SwapInfo>,
  'getTokenMetadata' : (arg_0: string) => Promise<TokenAnalyticsInfo>,
  'getUserBalances' : (arg_0: Principal) => Promise<Array<[string, bigint]>>,
  'getUserInfo' : (arg_0: Principal) => Promise<UserInfo>,
  'getUserInfoAbove' : (
      arg_0: Principal,
      arg_1: bigint,
      arg_2: bigint,
    ) => Promise<UserInfo>,
  'getUserInfoByNamePageAbove' : (
      arg_0: Principal,
      arg_1: bigint,
      arg_2: string,
      arg_3: bigint,
      arg_4: bigint,
      arg_5: bigint,
      arg_6: string,
      arg_7: bigint,
      arg_8: bigint,
    ) => Promise<UserInfoPage>,
  'getUserLPBalances' : (arg_0: Principal) => Promise<Array<[string, bigint]>>,
  'getUserLPBalancesAbove' : (arg_0: Principal, arg_1: bigint) => Promise<
      Array<[string, bigint]>
    >,
  'getUserReward' : (arg_0: Principal, arg_1: string, arg_2: string) => Promise<
      Result_1
    >,
  'historySize' : () => Promise<bigint>,
  'initiateICRC1Transfer' : () => Promise<Array<number>>,
  'initiateICRC1TransferForUser' : (arg_0: Principal) => Promise<ICRCTxReceipt>,
  'monitorMetrics' : () => Promise<MonitorMetrics>,
  'name' : (arg_0: string) => Promise<string>,
  'removeAuth' : (arg_0: Principal) => Promise<boolean>,
  'removeLiquidity' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: bigint,
      arg_3: bigint,
      arg_4: bigint,
      arg_5: Principal,
      arg_6: bigint,
    ) => Promise<TxReceipt>,
  'removeUserFromBlocklist' : (arg_0: Principal) => Promise<boolean>,
  'retryDeposit' : (arg_0: Principal) => Promise<TxReceipt>,
  'retryDepositTo' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: bigint,
    ) => Promise<TxReceipt>,
  'setCapV1EnableStatus' : (arg_0: boolean) => Promise<boolean>,
  'setCapV2CanisterId' : (arg_0: string) => Promise<boolean>,
  'setCapV2EnableStatus' : (arg_0: boolean) => Promise<Result>,
  'setFeeForToken' : (arg_0: string, arg_1: bigint) => Promise<boolean>,
  'setFeeOn' : (arg_0: boolean) => Promise<boolean>,
  'setFeeTo' : (arg_0: Principal) => Promise<boolean>,
  'setGlobalTokenFee' : (arg_0: bigint) => Promise<boolean>,
  'setMaxTokens' : (arg_0: bigint) => Promise<boolean>,
  'setOwner' : (arg_0: Principal) => Promise<boolean>,
  'swapExactTokensForTokens' : (
      arg_0: bigint,
      arg_1: bigint,
      arg_2: Array<string>,
      arg_3: Principal,
      arg_4: bigint,
    ) => Promise<TxReceipt>,
  'symbol' : (arg_0: string) => Promise<string>,
  'totalSupply' : (arg_0: string) => Promise<bigint>,
  'transferFrom' : (
      arg_0: string,
      arg_1: Principal,
      arg_2: Principal,
      arg_3: bigint,
    ) => Promise<boolean>,
  'updateAllTokenMetadata' : () => Promise<boolean>,
  'updateTokenFees' : () => Promise<boolean>,
  'updateTokenMetadata' : (arg_0: string) => Promise<boolean>,
  'withdraw' : (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>,
  }
  // ---------------------------------------------
  
  export type Factory = Swap;

  export const factory: IDL.InterfaceFactory = ({ IDL }) => {
    const TxReceipt = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
    const WithdrawState = IDL.Record({
      'tokenId' : IDL.Text,
      'refundStatus' : IDL.Bool,
      'value' : IDL.Nat,
      'userPId' : IDL.Principal,
    });
    const TokenInfoExt = IDL.Record({
      'id' : IDL.Text,
      'fee' : IDL.Nat,
      'decimals' : IDL.Nat8,
      'name' : IDL.Text,
      'totalSupply' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const PairInfoExt = IDL.Record({
      'id' : IDL.Text,
      'price0CumulativeLast' : IDL.Nat,
      'creator' : IDL.Principal,
      'reserve0' : IDL.Nat,
      'reserve1' : IDL.Nat,
      'lptoken' : IDL.Text,
      'totalSupply' : IDL.Nat,
      'token0' : IDL.Text,
      'token1' : IDL.Text,
      'price1CumulativeLast' : IDL.Nat,
      'kLast' : IDL.Nat,
      'blockTimestampLast' : IDL.Int,
    });
    const RewardInfo = IDL.Record({ 'tokenId' : IDL.Text, 'amount' : IDL.Nat });
    const Time = IDL.Int;
    const DepositSubAccounts = IDL.Record({
      'depositAId' : IDL.Text,
      'subaccount' : IDL.Vec(IDL.Nat8),
      'created_at' : Time,
      'transactionOwner' : IDL.Principal,
    });
    const SwapInfoExt = IDL.Record({
      'owner' : IDL.Principal,
      'txcounter' : IDL.Nat,
      'depositCounter' : IDL.Nat,
      'feeOn' : IDL.Bool,
      'feeTo' : IDL.Principal,
    });
    const WithdrawRefundReceipt = IDL.Variant({
      'Ok' : IDL.Bool,
      'Err' : IDL.Text,
    });
    const CapDetails = IDL.Record({
      'CapV2RootBucketId' : IDL.Opt(IDL.Text),
      'CapV1Status' : IDL.Bool,
      'CapV2Status' : IDL.Bool,
      'CapV1RootBucketId' : IDL.Opt(IDL.Text),
    });
    const ICRC1SubAccountBalance = IDL.Variant({
      'ok' : IDL.Nat,
      'err' : IDL.Text,
    });
    const SwapLastTransaction = IDL.Variant({
      'RemoveLiquidityOutAmount' : IDL.Tuple(IDL.Nat, IDL.Nat),
      'SwapOutAmount' : IDL.Nat,
      'NotFound' : IDL.Bool,
    });
    const TokenInfoWithType = IDL.Record({
      'id' : IDL.Text,
      'fee' : IDL.Nat,
      'decimals' : IDL.Nat8,
      'name' : IDL.Text,
      'totalSupply' : IDL.Nat,
      'tokenType' : IDL.Text,
      'symbol' : IDL.Text,
    });
    const SwapInfo = IDL.Record({
      'owner' : IDL.Principal,
      'cycles' : IDL.Nat,
      'tokens' : IDL.Vec(TokenInfoExt),
      'pairs' : IDL.Vec(PairInfoExt),
      'feeOn' : IDL.Bool,
      'feeTo' : IDL.Principal,
    });
    const TokenAnalyticsInfo = IDL.Record({
      'fee' : IDL.Nat,
      'decimals' : IDL.Nat8,
      'name' : IDL.Text,
      'totalSupply' : IDL.Nat,
      'symbol' : IDL.Text,
    });
    const UserInfo = IDL.Record({
      'lpBalances' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
      'balances' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    });
    const UserInfoPage = IDL.Record({
      'lpBalances' : IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
      'balances' : IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
    });
    const Result_1 = IDL.Variant({
      'ok' : IDL.Tuple(IDL.Nat, IDL.Nat),
      'err' : IDL.Text,
    });
    const ICRCTxReceipt = IDL.Variant({
      'Ok' : IDL.Vec(IDL.Nat8),
      'Err' : IDL.Text,
    });
    const Status = IDL.Variant({
      'stopped' : IDL.Null,
      'stopping' : IDL.Null,
      'running' : IDL.Null,
    });
    const CanisterSettings = IDL.Record({
      'freezing_threshold' : IDL.Opt(IDL.Nat),
      'controllers' : IDL.Opt(IDL.Vec(IDL.Principal)),
      'memory_allocation' : IDL.Opt(IDL.Nat),
      'compute_allocation' : IDL.Opt(IDL.Nat),
    });
    const CanisterStatus = IDL.Record({
      'status' : Status,
      'memory_size' : IDL.Nat,
      'cycles' : IDL.Nat,
      'settings' : CanisterSettings,
      'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    const MonitorMetrics = IDL.Record({
      'tokenBalancesSize' : IDL.Nat,
      'canisterStatus' : CanisterStatus,
      'blocklistedUsersCount' : IDL.Nat,
      'rewardTokensSize' : IDL.Nat,
      'lptokensSize' : IDL.Nat,
      'cycles' : IDL.Nat,
      'tokenAllowanceSize' : IDL.Nat,
      'rewardInfo' : IDL.Nat,
      'lpTokenAllowanceSize' : IDL.Nat,
      'rewardPairsSize' : IDL.Nat,
      'tokenCount' : IDL.Nat,
      'lpTokenBalancesSize' : IDL.Nat,
      'pairsCount' : IDL.Nat,
      'depositTransactionSize' : IDL.Nat,
    });
    const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
    return IDL.Service({
      'addAuth' : IDL.Func([IDL.Principal], [IDL.Bool], []),
      'addLiquidity' : IDL.Func(
          [
            IDL.Principal,
            IDL.Principal,
            IDL.Nat,
            IDL.Nat,
            IDL.Nat,
            IDL.Nat,
            IDL.Int,
          ],
          [TxReceipt],
          [],
        ),
      'addLiquidityForUser' : IDL.Func(
          [IDL.Principal, IDL.Principal, IDL.Principal, IDL.Nat, IDL.Nat],
          [TxReceipt],
          [],
        ),
      'addLiquidityForUserTest' : IDL.Func(
          [IDL.Principal, IDL.Principal, IDL.Principal, IDL.Nat, IDL.Nat],
          [IDL.Text],
          [],
        ),
      'addToken' : IDL.Func([IDL.Principal, IDL.Text], [TxReceipt], []),
      'addUserToBlocklist' : IDL.Func([IDL.Principal], [IDL.Bool], []),
      'allowance' : IDL.Func(
          [IDL.Text, IDL.Principal, IDL.Principal],
          [IDL.Nat],
          ['query'],
        ),
      'approve' : IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [IDL.Bool], []),
      'balanceOf' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Nat], ['query']),
      'burn' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
      'createPair' : IDL.Func([IDL.Principal, IDL.Principal], [TxReceipt], []),
      'decimals' : IDL.Func([IDL.Text], [IDL.Nat8], ['query']),
      'deposit' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
      'depositTo' : IDL.Func(
          [IDL.Principal, IDL.Principal, IDL.Nat],
          [TxReceipt],
          [],
        ),
      'exportBalances' : IDL.Func(
          [IDL.Text],
          [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)))],
          ['query'],
        ),
      'exportFaileWithdraws' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Text, WithdrawState))],
          ['query'],
        ),
      'exportLPTokens' : IDL.Func([], [IDL.Vec(TokenInfoExt)], ['query']),
      'exportPairs' : IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'exportRewardInfo' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(RewardInfo)))],
          ['query'],
        ),
      'exportRewardPairs' : IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'exportSubAccounts' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Principal, DepositSubAccounts))],
          ['query'],
        ),
      'exportSwapInfo' : IDL.Func([], [SwapInfoExt], ['query']),
      'exportTokenTypes' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
          ['query'],
        ),
      'exportTokens' : IDL.Func([], [IDL.Vec(TokenInfoExt)], ['query']),
      'failedWithdrawRefund' : IDL.Func([IDL.Text], [WithdrawRefundReceipt], []),
      'getAllPairs' : IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'getAllRewardPairs' : IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'getAuthList' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Bool))],
          ['query'],
        ),
      'getBlocklistedUsers' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Bool))],
          [],
        ),
      'getCapDetails' : IDL.Func([], [CapDetails], ['query']),
      'getHolders' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
      'getICRC1SubAccountBalance' : IDL.Func(
          [IDL.Principal, IDL.Text],
          [ICRC1SubAccountBalance],
          [],
        ),
      'getLPTokenId' : IDL.Func(
          [IDL.Principal, IDL.Principal],
          [IDL.Text],
          ['query'],
        ),
      'getLastTransactionOutAmount' : IDL.Func(
          [],
          [SwapLastTransaction],
          ['query'],
        ),
      'getNumPairs' : IDL.Func([], [IDL.Nat], ['query']),
      'getPair' : IDL.Func(
          [IDL.Principal, IDL.Principal],
          [IDL.Opt(PairInfoExt)],
          ['query'],
        ),
      'getPairs' : IDL.Func(
          [IDL.Nat, IDL.Nat],
          [IDL.Vec(PairInfoExt), IDL.Nat],
          ['query'],
        ),
      'getSupportedTokenList' : IDL.Func(
          [],
          [IDL.Vec(TokenInfoWithType)],
          ['query'],
        ),
      'getSupportedTokenListByName' : IDL.Func(
          [IDL.Text, IDL.Nat, IDL.Nat],
          [IDL.Vec(TokenInfoExt), IDL.Nat],
          ['query'],
        ),
      'getSupportedTokenListSome' : IDL.Func(
          [IDL.Nat, IDL.Nat],
          [IDL.Vec(TokenInfoExt), IDL.Nat],
          ['query'],
        ),
      'getSwapInfo' : IDL.Func([], [SwapInfo], ['query']),
      'getTokenMetadata' : IDL.Func([IDL.Text], [TokenAnalyticsInfo], ['query']),
      'getUserBalances' : IDL.Func(
          [IDL.Principal],
          [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
          ['query'],
        ),
      'getUserInfo' : IDL.Func([IDL.Principal], [UserInfo], ['query']),
      'getUserInfoAbove' : IDL.Func(
          [IDL.Principal, IDL.Nat, IDL.Nat],
          [UserInfo],
          ['query'],
        ),
      'getUserInfoByNamePageAbove' : IDL.Func(
          [
            IDL.Principal,
            IDL.Int,
            IDL.Text,
            IDL.Nat,
            IDL.Nat,
            IDL.Int,
            IDL.Text,
            IDL.Nat,
            IDL.Nat,
          ],
          [UserInfoPage],
          ['query'],
        ),
      'getUserLPBalances' : IDL.Func(
          [IDL.Principal],
          [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
          ['query'],
        ),
      'getUserLPBalancesAbove' : IDL.Func(
          [IDL.Principal, IDL.Nat],
          [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
          ['query'],
        ),
      'getUserReward' : IDL.Func(
          [IDL.Principal, IDL.Text, IDL.Text],
          [Result_1],
          ['query'],
        ),
      'historySize' : IDL.Func([], [IDL.Nat], ['query']),
      'initiateICRC1Transfer' : IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
      'initiateICRC1TransferForUser' : IDL.Func(
          [IDL.Principal],
          [ICRCTxReceipt],
          [],
        ),
      'monitorMetrics' : IDL.Func([], [MonitorMetrics], []),
      'name' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
      'removeAuth' : IDL.Func([IDL.Principal], [IDL.Bool], []),
      'removeLiquidity' : IDL.Func(
          [
            IDL.Principal,
            IDL.Principal,
            IDL.Nat,
            IDL.Nat,
            IDL.Nat,
            IDL.Principal,
            IDL.Int,
          ],
          [TxReceipt],
          [],
        ),
      'removeUserFromBlocklist' : IDL.Func([IDL.Principal], [IDL.Bool], []),
      'retryDeposit' : IDL.Func([IDL.Principal], [TxReceipt], []),
      'retryDepositTo' : IDL.Func(
          [IDL.Principal, IDL.Principal, IDL.Nat],
          [TxReceipt],
          [],
        ),
      'setCapV1EnableStatus' : IDL.Func([IDL.Bool], [IDL.Bool], []),
      'setCapV2CanisterId' : IDL.Func([IDL.Text], [IDL.Bool], []),
      'setCapV2EnableStatus' : IDL.Func([IDL.Bool], [Result], []),
      'setFeeForToken' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
      'setFeeOn' : IDL.Func([IDL.Bool], [IDL.Bool], []),
      'setFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
      'setGlobalTokenFee' : IDL.Func([IDL.Nat], [IDL.Bool], []),
      'setMaxTokens' : IDL.Func([IDL.Nat], [IDL.Bool], []),
      'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
      'swapExactTokensForTokens' : IDL.Func(
          [IDL.Nat, IDL.Nat, IDL.Vec(IDL.Text), IDL.Principal, IDL.Int],
          [TxReceipt],
          [],
        ),
      'symbol' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
      'totalSupply' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
      'transferFrom' : IDL.Func(
          [IDL.Text, IDL.Principal, IDL.Principal, IDL.Nat],
          [IDL.Bool],
          [],
        ),
      'updateAllTokenMetadata' : IDL.Func([], [IDL.Bool], []),
      'updateTokenFees' : IDL.Func([], [IDL.Bool], []),
      'updateTokenMetadata' : IDL.Func([IDL.Text], [IDL.Bool], []),
      'withdraw' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    });
    
  };
}
