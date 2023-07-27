const SONICSWAPCANDID = ({ IDL }) => {
  const TxReceipt = IDL.Variant({ 'ok': IDL.Nat, 'err': IDL.Text });
  const Time = IDL.Int;
  const DepositSubAccounts = IDL.Record({
    'depositAId': IDL.Text,
    'subaccount': IDL.Vec(IDL.Nat8),
    'created_at': Time,
    'transactionOwner': IDL.Principal,
  });
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
  const TokenAnalyticsInfo = IDL.Record({
    'fee': IDL.Nat,
    'decimals': IDL.Nat8,
    'name': IDL.Text,
    'totalSupply': IDL.Nat,
    'symbol': IDL.Text,
  });
  const UserInfo = IDL.Record({
    'lpBalances': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    'balances': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
  });
  const UserInfoPage = IDL.Record({
    'lpBalances': IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
    'balances': IDL.Tuple(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Nat),
  });
  const Result = IDL.Variant({
    'ok': IDL.Tuple(IDL.Nat, IDL.Nat),
    'err': IDL.Text,
  });
  const ICRCTxReceipt = IDL.Variant({
    'Ok': IDL.Vec(IDL.Nat8),
    'Err': IDL.Text,
  });
  return IDL.Service({
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
    'addLiquidityForUser': IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Principal, IDL.Nat, IDL.Nat],
      [TxReceipt],
      [],
    ),
    'addToken': IDL.Func([IDL.Principal, IDL.Text], [TxReceipt], []),
    'allowance': IDL.Func(
      [IDL.Text, IDL.Principal, IDL.Principal],
      [IDL.Nat],
      ['query'],
    ),
    'approve': IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [IDL.Bool], []),
    'backupDepositTransactions': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, DepositSubAccounts))],
      [],
    ),
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
    'exportSubAccounts': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, DepositSubAccounts))],
      [],
    ),
    'exportTokenTypes': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ['query'],
    ),
    'exportTokens': IDL.Func([], [IDL.Vec(TokenInfoExt)], ['query']),
    'getAllPairs': IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
    'getAllRewardPairs': IDL.Func([], [IDL.Vec(PairInfoExt)], ['query']),
    'getBalance': IDL.Func([IDL.Principal, IDL.Text], [IDL.Nat], []),
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
    'getTokenMetadata': IDL.Func([IDL.Text], [TokenAnalyticsInfo], ['query']),
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
    'getUserReward': IDL.Func(
      [IDL.Principal, IDL.Text, IDL.Text],
      [Result],
      ['query'],
    ),
    'historySize': IDL.Func([], [IDL.Nat], []),
    'initateTransfer': IDL.Func([], [IDL.Text], []),
    'initiateICRC1Transfer': IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    'initiateICRC1TransferForUser': IDL.Func(
      [IDL.Principal],
      [ICRCTxReceipt],
      [],
    ),
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
    'retryDeposit': IDL.Func([IDL.Principal], [TxReceipt], []),
    'retryDepositTo': IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Nat],
      [TxReceipt],
      [],
    ),
    'setDaoCanisterForLiquidity': IDL.Func([IDL.Principal], [IDL.Text], []),
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
}


const SONICX = ({ IDL }) => {
  const TxReceipt = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': IDL.Variant({
      'InsufficientAllowance': IDL.Null,
      'InsufficientBalance': IDL.Null,
      'ErrorOperationStyle': IDL.Null,
      'Unauthorized': IDL.Null,
      'LedgerTrap': IDL.Null,
      'ErrorTo': IDL.Null,
      'Other': IDL.Text,
      'BlockUsed': IDL.Null,
      'AmountTooSmall': IDL.Null,
    }),
  });
  const Address__2 = IDL.Text;
  const Gas__1 = IDL.Variant({
    'token': IDL.Nat,
    'cycles': IDL.Nat,
    'noFee': IDL.Null,
  });
  const AccountId__2 = IDL.Vec(IDL.Nat8);
  const Time__2 = IDL.Int;
  const Txid__3 = IDL.Vec(IDL.Nat8);
  const Operation__1 = IDL.Variant({
    'approve': IDL.Record({ 'allowance': IDL.Nat }),
    'lockTransfer': IDL.Record({
      'locked': IDL.Nat,
      'expiration': Time__2,
      'decider': AccountId__2,
    }),
    'transfer': IDL.Record({
      'action': IDL.Variant({
        'burn': IDL.Null,
        'mint': IDL.Null,
        'send': IDL.Null,
      }),
    }),
    'executeTransfer': IDL.Record({
      'fallback': IDL.Nat,
      'lockedTxid': Txid__3,
    }),
  });
  const Transaction__1 = IDL.Record({
    'to': AccountId__2,
    'value': IDL.Nat,
    'data': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from': AccountId__2,
    'operation': Operation__1,
  });
  const TxnRecord__2 = IDL.Record({
    'gas': Gas__1,
    'msgCaller': IDL.Opt(IDL.Principal),
    'transaction': Transaction__1,
    'txid': Txid__3,
    'nonce': IDL.Nat,
    'timestamp': Time__2,
    'caller': AccountId__2,
    'index': IDL.Nat,
  });
  const Setting__1 = IDL.Record({
    'MAX_STORAGE_TRIES': IDL.Nat,
    'EN_DEBUG': IDL.Bool,
    'MAX_CACHE_NUMBER_PER': IDL.Nat,
    'MAX_CACHE_TIME': IDL.Nat,
  });
  const Txid__2 = IDL.Vec(IDL.Nat8);
  const Address__1 = IDL.Text;
  const Spender = IDL.Text;
  const Amount = IDL.Nat;
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const Allowance = IDL.Record({
    'remaining': IDL.Nat,
    'spender': AccountId__1,
  });
  const Nonce = IDL.Nat;
  const Sa = IDL.Vec(IDL.Nat8);
  const Data = IDL.Vec(IDL.Nat8);
  const Txid__1 = IDL.Vec(IDL.Nat8);
  const TxnResult = IDL.Variant({
    'ok': Txid__1,
    'err': IDL.Record({
      'code': IDL.Variant({
        'NonceError': IDL.Null,
        'InsufficientGas': IDL.Null,
        'InsufficientAllowance': IDL.Null,
        'UndefinedError': IDL.Null,
        'InsufficientBalance': IDL.Null,
        'NoLockedTransfer': IDL.Null,
        'DuplicateExecutedTransfer': IDL.Null,
        'LockedTransferExpired': IDL.Null,
      }),
      'message': IDL.Text,
    }),
  });
  const Txid = IDL.Vec(IDL.Nat8);
  const ExecuteType = IDL.Variant({
    'fallback': IDL.Null,
    'send': IDL.Nat,
    'sendAll': IDL.Null,
  });
  const To = IDL.Text;
  const CoinSeconds = IDL.Record({
    'updateTime': IDL.Int,
    'coinSeconds': IDL.Nat,
  });
  const Timeout = IDL.Nat32;
  const Decider = IDL.Text;
  const From = IDL.Text;
  const Metadata__2 = IDL.Record({ 'content': IDL.Text, 'name': IDL.Text });
  const Gas = IDL.Variant({
    'token': IDL.Nat,
    'cycles': IDL.Nat,
    'noFee': IDL.Null,
  });
  const Time__1 = IDL.Int;
  const Operation = IDL.Variant({
    'approve': IDL.Record({ 'allowance': IDL.Nat }),
    'lockTransfer': IDL.Record({
      'locked': IDL.Nat,
      'expiration': Time__1,
      'decider': AccountId__1,
    }),
    'transfer': IDL.Record({
      'action': IDL.Variant({
        'burn': IDL.Null,
        'mint': IDL.Null,
        'send': IDL.Null,
      }),
    }),
    'executeTransfer': IDL.Record({
      'fallback': IDL.Nat,
      'lockedTxid': Txid__1,
    }),
  });
  const Transaction = IDL.Record({
    'to': AccountId__1,
    'value': IDL.Nat,
    'data': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from': AccountId__1,
    'operation': Operation,
  });
  const TxnRecord__1 = IDL.Record({
    'gas': Gas,
    'msgCaller': IDL.Opt(IDL.Principal),
    'transaction': Transaction,
    'txid': Txid__1,
    'nonce': IDL.Nat,
    'timestamp': Time__1,
    'caller': AccountId__1,
    'index': IDL.Nat,
  });
  const Callback__1 = IDL.Func([TxnRecord__1], [], []);
  const MsgType__1 = IDL.Variant({
    'onApprove': IDL.Null,
    'onExecute': IDL.Null,
    'onTransfer': IDL.Null,
    'onLock': IDL.Null,
  });
  const Callback = IDL.Func([TxnRecord__1], [], []);
  const MsgType = IDL.Variant({
    'onApprove': IDL.Null,
    'onExecute': IDL.Null,
    'onTransfer': IDL.Null,
    'onLock': IDL.Null,
  });
  const Subscription = IDL.Record({
    'callback': Callback,
    'msgTypes': IDL.Vec(MsgType),
  });
  const Address = IDL.Text;
  const TxnQueryRequest = IDL.Variant({
    'getEvents': IDL.Record({ 'owner': IDL.Opt(Address) }),
    'txnCount': IDL.Record({ 'owner': Address }),
    'lockedTxns': IDL.Record({ 'owner': Address }),
    'lastTxids': IDL.Record({ 'owner': Address }),
    'lastTxidsGlobal': IDL.Null,
    'getTxn': IDL.Record({ 'txid': Txid__1 }),
    'txnCountGlobal': IDL.Null,
  });
  const TxnQueryResponse = IDL.Variant({
    'getEvents': IDL.Vec(TxnRecord__1),
    'txnCount': IDL.Nat,
    'lockedTxns': IDL.Record({
      'txns': IDL.Vec(TxnRecord__1),
      'lockedBalance': IDL.Nat,
    }),
    'lastTxids': IDL.Vec(Txid__1),
    'lastTxidsGlobal': IDL.Vec(Txid__1),
    'getTxn': IDL.Opt(TxnRecord__1),
    'txnCountGlobal': IDL.Nat,
  });
  const TxnRecord = IDL.Record({
    'gas': Gas,
    'msgCaller': IDL.Opt(IDL.Principal),
    'transaction': Transaction,
    'txid': Txid__1,
    'nonce': IDL.Nat,
    'timestamp': Time__1,
    'caller': AccountId__1,
    'index': IDL.Nat,
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const Metadata__1 = IDL.Record({
    'fee': IDL.Nat,
    'decimals': IDL.Nat8,
    'owner': IDL.Principal,
    'logo': IDL.Text,
    'name': IDL.Text,
    'totalSupply': IDL.Nat,
    'symbol': IDL.Text,
  });
  const Time = IDL.Int;
  const TokenInfo = IDL.Record({
    'holderNumber': IDL.Nat,
    'deployTime': Time,
    'metadata': Metadata__1,
    'historySize': IDL.Nat,
    'cycles': IDL.Nat,
    'feeTo': IDL.Principal,
  });
  const Setting = IDL.Record({ 'MAX_PUBLICATION_TRIES': IDL.Nat });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account__1 = IDL.Record({
    'owner': IDL.Principal,
    'subaccount': IDL.Opt(Subaccount),
  });
  const Value = IDL.Variant({
    'Int': IDL.Int,
    'Nat': IDL.Nat,
    'Blob': IDL.Vec(IDL.Nat8),
    'Text': IDL.Text,
  });
  const Account = IDL.Record({
    'owner': IDL.Principal,
    'subaccount': IDL.Opt(Subaccount),
  });
  const Timestamp = IDL.Nat64;
  const TransferArgs = IDL.Record({
    'to': Account,
    'fee': IDL.Opt(IDL.Nat),
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount': IDL.Opt(Subaccount),
    'created_at_time': IDL.Opt(Timestamp),
    'amount': IDL.Nat,
  });
  const TransferError = IDL.Variant({
    'GenericError': IDL.Record({
      'message': IDL.Text,
      'error_code': IDL.Nat,
    }),
    'TemporarilyUnavailable': IDL.Null,
    'BadBurn': IDL.Record({ 'min_burn_amount': IDL.Nat }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });
  const AllowanceArgs = IDL.Record({
    'account': Account,
    'spender': Account,
  });
  const ApproveArgs = IDL.Record({
    'fee': IDL.Opt(IDL.Nat),
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat,
    'expected_allowance': IDL.Opt(IDL.Nat),
    'expires_at': IDL.Opt(IDL.Nat64),
    'spender': Account,
  });
  const ApproveError = IDL.Variant({
    'GenericError': IDL.Record({
      'message': IDL.Text,
      'error_code': IDL.Nat,
    }),
    'TemporarilyUnavailable': IDL.Null,
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'AllowanceChanged': IDL.Record({ 'current_allowance': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'Expired': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });
  const TransferFromArgs = IDL.Record({
    'to': Account,
    'fee': IDL.Opt(IDL.Nat),
    'spender_subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from': Account,
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(IDL.Nat64),
    'amount': IDL.Nat,
  });
  const TransferFromError = IDL.Variant({
    'GenericError': IDL.Record({
      'message': IDL.Text,
      'error_code': IDL.Nat,
    }),
    'TemporarilyUnavailable': IDL.Null,
    'InsufficientAllowance': IDL.Record({ 'allowance': IDL.Nat }),
    'BadBurn': IDL.Record({ 'min_burn_amount': IDL.Nat }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });
  return IDL.Service({
    'allowance': IDL.Func(
      [IDL.Principal, IDL.Principal],
      [IDL.Nat],
      ['query'],
    ),
    'approve': IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'balanceOf': IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'decimals': IDL.Func([], [IDL.Nat8], ['query']),
    'drc202_canisterId': IDL.Func([], [IDL.Principal], ['query']),
    'drc202_events': IDL.Func(
      [IDL.Opt(Address__2)],
      [IDL.Vec(TxnRecord__2)],
      ['query'],
    ),
    'drc202_getConfig': IDL.Func([], [Setting__1], ['query']),
    'drc202_pool': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(Txid__2, IDL.Nat))],
      ['query'],
    ),
    'drc202_txn': IDL.Func([Txid__2], [IDL.Opt(TxnRecord__2)], ['query']),
    'drc202_txn2': IDL.Func([Txid__2], [IDL.Opt(TxnRecord__2)], []),
    'drc20_allowance': IDL.Func([Address__1, Spender], [Amount], ['query']),
    'drc20_approvals': IDL.Func([Address__1], [IDL.Vec(Allowance)], ['query']),
    'drc20_approve': IDL.Func(
      [Spender, Amount, IDL.Opt(Nonce), IDL.Opt(Sa), IDL.Opt(Data)],
      [TxnResult],
      [],
    ),
    'drc20_balanceOf': IDL.Func([Address__1], [Amount], ['query']),
    'drc20_decimals': IDL.Func([], [IDL.Nat8], ['query']),
    'drc20_dropAccount': IDL.Func([IDL.Opt(Sa)], [IDL.Bool], []),
    'drc20_executeTransfer': IDL.Func(
      [
        Txid,
        ExecuteType,
        IDL.Opt(To),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data),
      ],
      [TxnResult],
      [],
    ),
    'drc20_fee': IDL.Func([], [Amount], ['query']),
    'drc20_getCoinSeconds': IDL.Func(
      [IDL.Opt(Address__1)],
      [CoinSeconds, IDL.Opt(CoinSeconds)],
      ['query'],
    ),
    'drc20_holdersCount': IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat], ['query']),
    'drc20_lockTransfer': IDL.Func(
      [
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data),
      ],
      [TxnResult],
      [],
    ),
    'drc20_lockTransferFrom': IDL.Func(
      [
        From,
        To,
        Amount,
        Timeout,
        IDL.Opt(Decider),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data),
      ],
      [TxnResult],
      [],
    ),
    'drc20_metadata': IDL.Func([], [IDL.Vec(Metadata__2)], ['query']),
    'drc20_name': IDL.Func([], [IDL.Text], ['query']),
    'drc20_subscribe': IDL.Func(
      [Callback__1, IDL.Vec(MsgType__1), IDL.Opt(Sa)],
      [IDL.Bool],
      [],
    ),
    'drc20_subscribed': IDL.Func(
      [Address__1],
      [IDL.Opt(Subscription)],
      ['query'],
    ),
    'drc20_symbol': IDL.Func([], [IDL.Text], ['query']),
    'drc20_totalSupply': IDL.Func([], [Amount], ['query']),
    'drc20_transfer': IDL.Func(
      [To, Amount, IDL.Opt(Nonce), IDL.Opt(Sa), IDL.Opt(Data)],
      [TxnResult],
      [],
    ),
    'drc20_transferBatch': IDL.Func(
      [
        IDL.Vec(To),
        IDL.Vec(Amount),
        IDL.Opt(Nonce),
        IDL.Opt(Sa),
        IDL.Opt(Data),
      ],
      [IDL.Vec(TxnResult)],
      [],
    ),
    'drc20_transferFrom': IDL.Func(
      [From, To, Amount, IDL.Opt(Nonce), IDL.Opt(Sa), IDL.Opt(Data)],
      [TxnResult],
      [],
    ),
    'drc20_txnQuery': IDL.Func(
      [TxnQueryRequest],
      [TxnQueryResponse],
      ['query'],
    ),
    'drc20_txnRecord': IDL.Func([Txid], [IDL.Opt(TxnRecord)], []),
    'exportBalances': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(AccountId, IDL.Nat))],
      ['query'],
    ),
    'getMetadata': IDL.Func([], [Metadata__1], ['query']),
    'getTokenFee': IDL.Func([], [IDL.Nat], ['query']),
    'getTokenInfo': IDL.Func([], [TokenInfo], ['query']),
    'historySize': IDL.Func([], [IDL.Nat], ['query']),
    'icpubsub_getConfig': IDL.Func([], [Setting], ['query']),
    'icrc1_balance_of': IDL.Func([Account__1], [IDL.Nat], ['query']),
    'icrc1_decimals': IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee': IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_metadata': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, Value))],
      ['query'],
    ),
    'icrc1_minting_account': IDL.Func([], [IDL.Opt(Account__1)], ['query']),
    'icrc1_name': IDL.Func([], [IDL.Text], ['query']),
    'icrc1_supported_standards': IDL.Func(
      [],
      [IDL.Vec(IDL.Record({ 'url': IDL.Text, 'name': IDL.Text }))],
      ['query'],
    ),
    'icrc1_symbol': IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply': IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_transfer': IDL.Func(
      [TransferArgs],
      [IDL.Variant({ 'Ok': IDL.Nat, 'Err': TransferError })],
      [],
    ),
    'icrc2_allowance': IDL.Func(
      [AllowanceArgs],
      [
        IDL.Record({
          'allowance': IDL.Nat,
          'expires_at': IDL.Opt(IDL.Nat64),
        }),
      ],
      ['query'],
    ),
    'icrc2_approve': IDL.Func(
      [ApproveArgs],
      [IDL.Variant({ 'Ok': IDL.Nat, 'Err': ApproveError })],
      [],
    ),
    'icrc2_transfer_from': IDL.Func(
      [TransferFromArgs],
      [IDL.Variant({ 'Ok': IDL.Nat, 'Err': TransferFromError })],
      [],
    ),
    'logo': IDL.Func([], [IDL.Text], ['query']),
    'name': IDL.Func([], [IDL.Text], ['query']),
    'standard': IDL.Func([], [IDL.Text], ['query']),
    'symbol': IDL.Func([], [IDL.Text], ['query']),
    'totalSupply': IDL.Func([], [IDL.Nat], ['query']),
    'transfer': IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'transferFrom': IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Nat],
      [TxReceipt],
      [],
    ),
    'wallet_receive': IDL.Func([], [], []),
  });
};

module.exports = { SONICSWAPCANDID, SONICX };