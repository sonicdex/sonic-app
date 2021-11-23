export default ({ IDL }) => {
    const TxReceipt = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
    const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
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
    const TokenInfoExt = IDL.Record({
        'id' : IDL.Text,
        'fee' : IDL.Nat,
        'decimals' : IDL.Nat8,
        'name' : IDL.Text,
        'totalSupply' : IDL.Nat,
        'symbol' : IDL.Text,
    });
    const DSwapInfo = IDL.Record({
        'storageCanisterId' : IDL.Principal,
        'owner' : IDL.Principal,
        'cycles' : IDL.Nat,
        'tokens' : IDL.Vec(TokenInfoExt),
        'pairs' : IDL.Vec(PairInfoExt),
    });
    const UserInfo = IDL.Record({
        'lpBalances' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
        'balances' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    });
    const UserInfoPage = IDL.Record({
        'lpBalances' : IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
        'balances' : IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
    });
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
        'addToken' : IDL.Func([IDL.Principal], [Result], []),
        'allowance' : IDL.Func(
            [IDL.Text, IDL.Principal, IDL.Principal],
            [IDL.Nat],
            ['query'],
        ),
        'approve' : IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [IDL.Bool], []),
        'balanceOf' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Nat], ['query']),
        'checkTxCounter' : IDL.Func([], [IDL.Bool], []),
        'createPair' : IDL.Func([IDL.Principal, IDL.Principal], [TxReceipt], []),
        'decimals' : IDL.Func([IDL.Text], [IDL.Nat8], ['query']),
        'deposit' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
        'depositTo' : IDL.Func(
            [IDL.Principal, IDL.Principal, IDL.Nat],
            [TxReceipt],
            [],
        ),
        'getAllPairs' : IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
        'getDSwapInfo' : IDL.Func([], [DSwapInfo], ['query']),
        'getLPTokenId' : IDL.Func(
            [IDL.Principal, IDL.Principal],
            [IDL.Text],
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
        'getSupportedTokenList' : IDL.Func([], [IDL.Vec(TokenInfoExt)], ['query']),
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
        'lazySwap' : IDL.Func(
            [IDL.Nat, IDL.Nat, IDL.Vec(IDL.Text), IDL.Principal],
            [TxReceipt],
            [],
        ),
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
        'setAddTokenThresh' : IDL.Func([IDL.Nat], [IDL.Bool], []),
        'setFeeForToken' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
        'setFeeOn' : IDL.Func([IDL.Bool], [IDL.Bool], []),
        'setFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
        'setGlobalTokenFee' : IDL.Func([IDL.Nat], [IDL.Bool], []),
        'setMaxTokens' : IDL.Func([IDL.Nat], [IDL.Bool], []),
        'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
        'setStorageCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
        'swapExactTokensForTokens' : IDL.Func(
            [IDL.Nat, IDL.Nat, IDL.Vec(IDL.Text), IDL.Principal, IDL.Int],
            [TxReceipt],
            [],
        ),
        'swapTokensForExactTokens' : IDL.Func(
            [IDL.Nat, IDL.Nat, IDL.Vec(IDL.Text), IDL.Principal, IDL.Int],
            [TxReceipt],
            [],
        ),
        'symbol' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
        'totalSupply' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
        'transfer' : IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [IDL.Bool], []),
        'transferFrom' : IDL.Func(
            [IDL.Text, IDL.Principal, IDL.Principal, IDL.Nat],
            [IDL.Bool],
            [],
        ),
        'withdraw' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
        'withdrawTo' : IDL.Func(
            [IDL.Principal, IDL.Principal, IDL.Nat],
            [TxReceipt],
            [],
        ),
    });
};
export const init = ({ IDL }) => { return []; };
