import { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export namespace SwapIDL {
  export interface PairInfoExt {
    'id': string,
    'price0CumulativeLast': bigint,
    'creator': Principal,
    'reserve0': bigint,
    'reserve1': bigint,
    'lptoken': string,
    'totalSupply': bigint,
    'token0': string,
    'token1': string,
    'price1CumulativeLast': bigint,
    'kLast': bigint,
    'blockTimestampLast': bigint,
  };
  export interface SwapInfo {
    'owner': Principal,
    'cycles': bigint,
    'tokens': Array<TokenInfoExt>,
    'pairs': Array<PairInfoExt>,
  };
  export interface TokenInfoExt {
    'id': string,
    'fee': bigint,
    'decimals': number,
    'name': string,
    'totalSupply': bigint,
    'symbol': string,
  };
  export interface TokenInfoWithType {
    'id': string,
    'fee': bigint,
    'decimals': number,
    'name': string,
    'totalSupply': bigint,
    'tokenType': string,
    'symbol': string,
  };
  export type TxReceipt = { 'ok': bigint } |
  { 'err': string };
  export interface UserInfo {
    'lpBalances': Array<[string, bigint]>,
    'balances': Array<[string, bigint]>,
  };
  export interface UserInfoPage {
    'lpBalances': [Array<[string, bigint]>, bigint],
    'balances': [Array<[string, bigint]>, bigint],
  };
  export type Result = { ok: boolean } | { err: string };

  export interface Swap {
    'addAuth': (arg_0: Principal) => Promise<boolean>,
    'addLiquidity': (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: bigint,
      arg_3: bigint,
      arg_4: bigint,
      arg_5: bigint,
      arg_6: bigint,
    ) => Promise<TxReceipt>,
    'addToken': (arg_0: Principal) => Promise<TxReceipt>,
    'addTokenTypes': (arg_0: Principal, arg_1: string) => Promise<TxReceipt>,
    'addTokenWithType': (arg_0: Principal, arg_1: string) => Promise<TxReceipt>,
    'allowance': (arg_0: string, arg_1: Principal, arg_2: Principal) => Promise<
      bigint
    >,
    'approve': (arg_0: string, arg_1: Principal, arg_2: bigint) => Promise<
      boolean
    >,
    'balanceOf': (arg_0: string, arg_1: Principal) => Promise<bigint>,
    'burn': (arg_0: string, arg_1: bigint) => Promise<boolean>,
    'createPair': (arg_0: Principal, arg_1: Principal) => Promise<TxReceipt>,
    'decimals': (arg_0: string) => Promise<number>,
    'deposit': (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>,
    'depositTo': (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<
      TxReceipt
    >,
    'exportBalances': (arg_0: string) => Promise<
      [] | [Array<[Principal, bigint]>]
    >,
    'exportLPTokens': () => Promise<Array<TokenInfoExt>>,
    'exportPairs': () => Promise<Array<PairInfoExt>>,
    'exportTokenTypes': () => Promise<Array<[string, string]>>,
    'exportTokens': () => Promise<Array<TokenInfoExt>>,
    'getAllPairs': () => Promise<Array<PairInfoExt>>,
    'getHolders': (arg_0: string) => Promise<bigint>,
    'getLPTokenId': (arg_0: Principal, arg_1: Principal) => Promise<string>,
    'getNumPairs': () => Promise<bigint>,
    'getPair': (arg_0: Principal, arg_1: Principal) => Promise<
      [] | [PairInfoExt]
    >,
    'getPairs': (arg_0: bigint, arg_1: bigint) => Promise<
      [Array<PairInfoExt>, bigint]
    >,
    'getSupportedTokenList': () => Promise<Array<TokenInfoWithType>>,
    'getSupportedTokenListByName': (
      arg_0: string,
      arg_1: bigint,
      arg_2: bigint,
    ) => Promise<[Array<TokenInfoExt>, bigint]>,
    'getSupportedTokenListSome': (arg_0: bigint, arg_1: bigint) => Promise<
      [Array<TokenInfoExt>, bigint]
    >,
    'getSwapInfo': () => Promise<SwapInfo>,
    'getUserBalances': (arg_0: Principal) => Promise<Array<[string, bigint]>>,
    'getUserInfo': (arg_0: Principal) => Promise<UserInfo>,
    'getUserInfoAbove': (
      arg_0: Principal,
      arg_1: bigint,
      arg_2: bigint,
    ) => Promise<UserInfo>,
    'getUserInfoByNamePageAbove': (
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
    'getUserLPBalances': (arg_0: Principal) => Promise<Array<[string, bigint]>>,
    'getUserLPBalancesAbove': (arg_0: Principal, arg_1: bigint) => Promise<
      Array<[string, bigint]>
    >,
    'historySize': () => Promise<bigint>,
    'initateTransfer': () => Promise<string>,
    'logMessageClear': () => Promise<undefined>,
    'logMessageGet': () => Promise<Array<string>>,
    'name': (arg_0: string) => Promise<string>,
    'removeAuth': (arg_0: Principal) => Promise<boolean>,
    'removeLiquidity': (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: bigint,
      arg_3: bigint,
      arg_4: bigint,
      arg_5: Principal,
      arg_6: bigint,
    ) => Promise<TxReceipt>,
    'setFeeForToken': (arg_0: string, arg_1: bigint) => Promise<boolean>,
    'setFeeOn': (arg_0: boolean) => Promise<boolean>,
    'setFeeTo': (arg_0: Principal) => Promise<boolean>,
    'setGlobalTokenFee': (arg_0: bigint) => Promise<boolean>,
    'setMaxTokens': (arg_0: bigint) => Promise<boolean>,
    'setOwner': (arg_0: Principal) => Promise<boolean>,
    'setPairSupply': (arg_0: string, arg_1: bigint) => Promise<boolean>,
    'setPermissionless': (arg_0: boolean) => Promise<boolean>,
    'swapExactTokensForTokens': (
      arg_0: bigint,
      arg_1: bigint,
      arg_2: Array<string>,
      arg_3: Principal,
      arg_4: bigint,
    ) => Promise<TxReceipt>,
    'swapTokensForExactTokens': (
      arg_0: bigint,
      arg_1: bigint,
      arg_2: Array<string>,
      arg_3: Principal,
      arg_4: bigint,
    ) => Promise<TxReceipt>,
    'symbol': (arg_0: string) => Promise<string>,
    'totalSupply': (arg_0: string) => Promise<bigint>,
    'transfer': (arg_0: string, arg_1: Principal, arg_2: bigint) => Promise<
      boolean
    >,
    'transferFrom': (
      arg_0: string,
      arg_1: Principal,
      arg_2: Principal,
      arg_3: bigint,
    ) => Promise<boolean>,
    'updateAllTokenMetadata': () => Promise<boolean>,
    'updateTokenFees': () => Promise<boolean>,
    'updateTokenMetadata': (arg_0: string) => Promise<boolean>,
    'withdraw': (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>,
    'withdrawTo': (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<
      TxReceipt
    >,
  }

  export type Factory = Swap;

  export const factory: IDL.InterfaceFactory = ({ IDL }) => {
    const TxReceipt = IDL.Variant({ 'ok': IDL.Nat, 'err': IDL.Text });
    const TokenInfoExt = IDL.Record({
      'id': IDL.Text,
      'fee': IDL.Nat,
      'decimals': IDL.Nat8,
      'name': IDL.Text,
      'totalSupply': IDL.Nat,
      'symbol': IDL.Text,
    });
    const PairInfoExt = IDL.Record({
      'id': IDL.Text,
      'price0CumulativeLast': IDL.Nat,
      'creator': IDL.Principal,
      'reserve0': IDL.Nat,
      'reserve1': IDL.Nat,
      'lptoken': IDL.Text,
      'totalSupply': IDL.Nat,
      'token0': IDL.Text,
      'token1': IDL.Text,
      'price1CumulativeLast': IDL.Nat,
      'kLast': IDL.Nat,
      'blockTimestampLast': IDL.Int,
    });
    const TokenInfoWithType = IDL.Record({
      'id': IDL.Text,
      'fee': IDL.Nat,
      'decimals': IDL.Nat8,
      'name': IDL.Text,
      'totalSupply': IDL.Nat,
      'tokenType': IDL.Text,
      'symbol': IDL.Text,
    });
    const SwapInfo = IDL.Record({
      'owner': IDL.Principal,
      'cycles': IDL.Nat,
      'tokens': IDL.Vec(TokenInfoExt),
      'pairs': IDL.Vec(PairInfoExt),
    });
    const UserInfo = IDL.Record({
      'lpBalances': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
      'balances': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    });
    const UserInfoPage = IDL.Record({
      'lpBalances': IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
      'balances': IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
    });

    const Swap = IDL.Service({
      'addAuth': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'addLiquidity': IDL.Func(
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
      'addToken': IDL.Func([IDL.Principal], [TxReceipt], []),
      'addTokenTypes': IDL.Func([IDL.Principal, IDL.Text], [TxReceipt], []),
      'addTokenWithType': IDL.Func([IDL.Principal, IDL.Text], [TxReceipt], []),
      'allowance': IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Principal],
        [IDL.Nat],
        ['query'],
      ),
      'approve': IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [IDL.Bool], []),
      'balanceOf': IDL.Func([IDL.Text, IDL.Principal], [IDL.Nat], ['query']),
      'burn': IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
      'createPair': IDL.Func([IDL.Principal, IDL.Principal], [TxReceipt], []),
      'decimals': IDL.Func([IDL.Text], [IDL.Nat8], ['query']),
      'deposit': IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
      'depositTo': IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
      'exportBalances': IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)))],
        ['query'],
      ),
      'exportLPTokens': IDL.Func([], [IDL.Vec(TokenInfoExt)], ['query']),
      'exportPairs': IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'exportTokenTypes': IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
      'exportTokens': IDL.Func([], [IDL.Vec(TokenInfoExt)], ['query']),
      'getAllPairs': IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
      'getHolders': IDL.Func([IDL.Text], [IDL.Nat], ['query']),
      'getLPTokenId': IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Text],
        ['query'],
      ),
      'getNumPairs': IDL.Func([], [IDL.Nat], ['query']),
      'getPair': IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Opt(PairInfoExt)],
        ['query'],
      ),
      'getPairs': IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(PairInfoExt), IDL.Nat],
        ['query'],
      ),
      'getSupportedTokenList': IDL.Func(
        [],
        [IDL.Vec(TokenInfoWithType)],
        ['query'],
      ),
      'getSupportedTokenListByName': IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [IDL.Vec(TokenInfoExt), IDL.Nat],
        ['query'],
      ),
      'getSupportedTokenListSome': IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(TokenInfoExt), IDL.Nat],
        ['query'],
      ),
      'getSwapInfo': IDL.Func([], [SwapInfo], ['query']),
      'getUserBalances': IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
      'getUserInfo': IDL.Func([IDL.Principal], [UserInfo], ['query']),
      'getUserInfoAbove': IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Nat],
        [UserInfo],
        ['query'],
      ),
      'getUserInfoByNamePageAbove': IDL.Func(
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
      'getUserLPBalances': IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
      'getUserLPBalancesAbove': IDL.Func(
        [IDL.Principal, IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
      'historySize': IDL.Func([], [IDL.Nat], []),
      'initateTransfer': IDL.Func([], [IDL.Text], []),
      'logMessageClear': IDL.Func([], [], []),
      'logMessageGet': IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
      'name': IDL.Func([IDL.Text], [IDL.Text], ['query']),
      'removeAuth': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'removeLiquidity': IDL.Func(
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
      'setFeeForToken': IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
      'setFeeOn': IDL.Func([IDL.Bool], [IDL.Bool], []),
      'setFeeTo': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'setGlobalTokenFee': IDL.Func([IDL.Nat], [IDL.Bool], []),
      'setMaxTokens': IDL.Func([IDL.Nat], [IDL.Bool], []),
      'setOwner': IDL.Func([IDL.Principal], [IDL.Bool], []),
      'setPairSupply': IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
      'setPermissionless': IDL.Func([IDL.Bool], [IDL.Bool], []),
      'swapExactTokensForTokens': IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Vec(IDL.Text), IDL.Principal, IDL.Int],
        [TxReceipt],
        [],
      ),
      'swapTokensForExactTokens': IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Vec(IDL.Text), IDL.Principal, IDL.Int],
        [TxReceipt],
        [],
      ),
      'symbol': IDL.Func([IDL.Text], [IDL.Text], ['query']),
      'totalSupply': IDL.Func([IDL.Text], [IDL.Nat], ['query']),
      'transfer': IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [IDL.Bool], []),
      'transferFrom': IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Principal, IDL.Nat],
        [IDL.Bool],
        [],
      ),
      'updateAllTokenMetadata': IDL.Func([], [IDL.Bool], []),
      'updateTokenFees': IDL.Func([], [IDL.Bool], []),
      'updateTokenMetadata': IDL.Func([IDL.Text], [IDL.Bool], []),
      'withdraw': IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
      'withdrawTo': IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
    });
    return Swap;
  };
}
