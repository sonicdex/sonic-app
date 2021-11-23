export default ({ IDL }) => {
    const Operation__1 = IDL.Variant({
        'lpTransfer' : IDL.Null,
        'lpApprove' : IDL.Null,
        'withdraw' : IDL.Null,
        'tokenTransfer' : IDL.Null,
        'swap' : IDL.Null,
        'addLiquidity' : IDL.Null,
        'createPair' : IDL.Null,
        'deposit' : IDL.Null,
        'removeLiquidity' : IDL.Null,
        'lpTransferFrom' : IDL.Null,
        'tokenTransferFrom' : IDL.Null,
        'tokenApprove' : IDL.Null,
    });
    const Time = IDL.Int;
    const Operation = IDL.Variant({
        'lpTransfer' : IDL.Null,
        'lpApprove' : IDL.Null,
        'withdraw' : IDL.Null,
        'tokenTransfer' : IDL.Null,
        'swap' : IDL.Null,
        'addLiquidity' : IDL.Null,
        'createPair' : IDL.Null,
        'deposit' : IDL.Null,
        'removeLiquidity' : IDL.Null,
        'lpTransferFrom' : IDL.Null,
        'tokenTransferFrom' : IDL.Null,
        'tokenApprove' : IDL.Null,
    });
    const TxRecord = IDL.Record({
        'op' : Operation,
        'to' : IDL.Principal,
        'fee' : IDL.Nat,
        'tokenId' : IDL.Text,
        'from' : IDL.Principal,
        'amount0' : IDL.Nat,
        'amount1' : IDL.Nat,
        'timestamp' : Time,
        'caller' : IDL.Principal,
        'index' : IDL.Nat,
        'amount' : IDL.Nat,
    });
    const Status = IDL.Record({
        'memSize' : IDL.Nat,
        'storageId' : IDL.Principal,
        'cycles' : IDL.Nat,
        'start' : IDL.Nat,
        'length' : IDL.Nat,
    });
    const Bucket = IDL.Service({
        'addRecords' : IDL.Func([IDL.Vec(TxRecord)], [IDL.Nat], []),
        'getStatus' : IDL.Func([], [Status], ['query']),
        'getTransaction' : IDL.Func([IDL.Nat], [TxRecord], ['query']),
        'getTransactions' : IDL.Func(
            [IDL.Nat, IDL.Nat],
            [IDL.Vec(TxRecord)],
            ['query'],
        ),
    });
    const BucketInfoExt = IDL.Record({
        'id' : IDL.Nat,
        'bucketId' : IDL.Principal,
        'start' : IDL.Nat,
        'length' : IDL.Nat,
    });
    const Status__1 = IDL.Record({
        'recordsPerBucket' : IDL.Nat,
        'memSize' : IDL.Nat,
        'owner' : IDL.Principal,
        'txAmount' : IDL.Nat,
        'cycles' : IDL.Nat,
        'flushing' : IDL.Bool,
        'bufferSize' : IDL.Nat,
        'chunkSize' : IDL.Nat,
        'dswap' : IDL.Principal,
        'buckets' : IDL.Vec(BucketInfoExt),
    });
    const TxRecord__1 = IDL.Record({
        'op' : Operation,
        'to' : IDL.Principal,
        'fee' : IDL.Nat,
        'tokenId' : IDL.Text,
        'from' : IDL.Principal,
        'amount0' : IDL.Nat,
        'amount1' : IDL.Nat,
        'timestamp' : Time,
        'caller' : IDL.Principal,
        'index' : IDL.Nat,
        'amount' : IDL.Nat,
    });
    return IDL.Service({
        'addRecord' : IDL.Func(
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
            [],
        ),
        'flush' : IDL.Func([], [IDL.Bool], []),
        'getBucket' : IDL.Func([], [Bucket], []),
        'getStatus' : IDL.Func([], [Status__1], ['query']),
        'getTransaction' : IDL.Func([IDL.Nat], [TxRecord__1], []),
        'getTransactions' : IDL.Func(
            [IDL.Nat, IDL.Nat],
            [IDL.Vec(TxRecord__1)],
            [],
        ),
        'getUserTransactionAmount' : IDL.Func(
            [IDL.Principal],
            [IDL.Nat],
            ['query'],
        ),
        'getUserTransactions' : IDL.Func(
            [IDL.Principal, IDL.Nat, IDL.Nat],
            [IDL.Vec(TxRecord__1)],
            [],
        ),
        'historySize' : IDL.Func([], [IDL.Nat], []),
        'newBucket' : IDL.Func([], [Bucket], []),
        'setDSwapCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    });
};
export const init = ({ IDL }) => { return []; };
