import { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export namespace capCanIDL {
    export type DetailValue = { 'I64': bigint } |
    { 'U64': bigint } |
    { 'Vec': Array<DetailValue> } |
    { 'Slice': Array<number> } |
    { 'Text': string } |
    { 'True': null } |
    { 'False': null } |
    { 'Float': number } |
    { 'Principal': Principal };
    export interface Event {
        'time': bigint,
        'operation': string,
        'details': Array<[string, DetailValue]>,
        'caller': Principal,
    };
    export interface GetBucketResponse {
        'witness': [] | [Witness],
        'canister': Principal,
    };
    export interface GetNextCanistersResponse {
        'witness': [] | [Witness],
        'canisters': Array<Principal>,
    };
    export type GetTransactionResponse = {
        'Delegate': [Principal, [] | [Witness]]
    } |
    { 'Found': [[] | [Event], [] | [Witness]] };
    export interface GetTransactionsArg {
        'page': [] | [number],
        'witness': boolean,
    };
    export interface GetTransactionsResponseBorrowed {
        'data': Array<Event>,
        'page': number,
        'witness': [] | [Witness],
    };
    export interface GetUserTransactionsArg {
        'page': [] | [number],
        'user': Principal,
        'witness': boolean,
    };
    export interface IndefiniteEvent {
        'operation': string,
        'details': Array<[string, DetailValue]>,
        'caller': Principal,
    };
    export interface WithIdArg { 'id': bigint, 'witness': boolean };
    export interface WithWitnessArg { 'witness': boolean };
    export interface Witness {
        'certificate': Array<number>,
        'tree': Array<number>,
    };
    export interface capCan {
        'balance': () => Promise<bigint>,
        'contract_id': () => Promise<Principal>,
        'get_bucket_for': (arg_0: WithIdArg) => Promise<GetBucketResponse>,
        'get_next_canisters': (arg_0: WithWitnessArg) => Promise<
            GetNextCanistersResponse
        >,
        'get_transaction': (arg_0: WithIdArg) => Promise<GetTransactionResponse>,
        'get_transactions': (arg_0: GetTransactionsArg) => Promise<
            GetTransactionsResponseBorrowed
        >,
        'get_user_transactions': (arg_0: GetUserTransactionsArg) => Promise<
            GetTransactionsResponseBorrowed
        >,
        'insert': (arg_0: IndefiniteEvent) => Promise<bigint>,
        'migrate': (arg_0: Array<Event>) => Promise<undefined>,
        'size': () => Promise<bigint>,
        'time': () => Promise<bigint>,
    };
    export type Factory = capCan;

    export const factory: IDL.InterfaceFactory = ({ IDL }) => {
        const DetailValue = IDL.Rec();
        const WithIdArg = IDL.Record({ 'id': IDL.Nat64, 'witness': IDL.Bool });
        const Witness = IDL.Record({
            'certificate': IDL.Vec(IDL.Nat8),
            'tree': IDL.Vec(IDL.Nat8),
        });
        const GetBucketResponse = IDL.Record({
            'witness': IDL.Opt(Witness),
            'canister': IDL.Principal,
        });
        const WithWitnessArg = IDL.Record({ 'witness': IDL.Bool });
        const GetNextCanistersResponse = IDL.Record({
            'witness': IDL.Opt(Witness),
            'canisters': IDL.Vec(IDL.Principal),
        });
        DetailValue.fill(
            IDL.Variant({
                'I64': IDL.Int64,
                'U64': IDL.Nat64,
                'Vec': IDL.Vec(DetailValue),
                'Slice': IDL.Vec(IDL.Nat8),
                'Text': IDL.Text,
                'True': IDL.Null,
                'False': IDL.Null,
                'Float': IDL.Float64,
                'Principal': IDL.Principal,
            })
        );
        const Event = IDL.Record({
            'time': IDL.Nat64,
            'operation': IDL.Text,
            'details': IDL.Vec(IDL.Tuple(IDL.Text, DetailValue)),
            'caller': IDL.Principal,
        });
        const GetTransactionResponse = IDL.Variant({
            'Delegate': IDL.Tuple(IDL.Principal, IDL.Opt(Witness)),
            'Found': IDL.Tuple(IDL.Opt(Event), IDL.Opt(Witness)),
        });
        const GetTransactionsArg = IDL.Record({
            'page': IDL.Opt(IDL.Nat32),
            'witness': IDL.Bool,
        });
        const GetTransactionsResponseBorrowed = IDL.Record({
            'data': IDL.Vec(Event),
            'page': IDL.Nat32,
            'witness': IDL.Opt(Witness),
        });
        const GetUserTransactionsArg = IDL.Record({
            'page': IDL.Opt(IDL.Nat32),
            'user': IDL.Principal,
            'witness': IDL.Bool,
        });
        const IndefiniteEvent = IDL.Record({
            'operation': IDL.Text,
            'details': IDL.Vec(IDL.Tuple(IDL.Text, DetailValue)),
            'caller': IDL.Principal,
        });
        return IDL.Service({
            'balance': IDL.Func([], [IDL.Nat64], ['query']),
            'contract_id': IDL.Func([], [IDL.Principal], ['query']),
            'get_bucket_for': IDL.Func([WithIdArg], [GetBucketResponse], ['query']),
            'get_next_canisters': IDL.Func(
                [WithWitnessArg],
                [GetNextCanistersResponse],
                ['query'],
            ),
            'get_transaction': IDL.Func(
                [WithIdArg],
                [GetTransactionResponse],
                ['query'],
            ),
            'get_transactions': IDL.Func(
                [GetTransactionsArg],
                [GetTransactionsResponseBorrowed],
                ['query'],
            ),
            'get_user_transactions': IDL.Func(
                [GetUserTransactionsArg],
                [GetTransactionsResponseBorrowed],
                ['query'],
            ),
            'insert': IDL.Func([IndefiniteEvent], [IDL.Nat64], []),
            'migrate': IDL.Func([IDL.Vec(Event)], [], []),
            'size': IDL.Func([], [IDL.Nat64], ['query']),
            'time': IDL.Func([], [IDL.Nat64], ['query']),
        });
    }

}