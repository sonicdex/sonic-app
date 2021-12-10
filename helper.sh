# Canister ids
SWAP_CANISTER = goeik-taaaa-aaaah-qcduq-cai
WICP_TEST = wjsrf-myaaa-aaaam-qaayq-cai
TEST_TOKEN = a7saq-3aaaa-aaaai-qbcdq-cai
BETA_TOKEN = cfoim-fqaaa-aaaai-qbcmq-cai


# Get balance in token canister
$ dfx canister --network ic call cfoim-fqaaa-aaaai-qbcmq-cai balanceOf "(principal \"$(dfx identity get-principal)\")"
(883_000_000 : nat)

# Approve transfer
$ dfx canister --network ic call a7saq-3aaaa-aaaai-qbcdq-cai approve "(principal \"goeik-taaaa-aaaah-qcduq-cai\", 10_000_000:nat)"
(variant { ok = 2 : nat })

# Transfer to sonic
$ dfx canister --network ic call goeik-taaaa-aaaah-qcduq-cai deposit "(principal \"a7saq-3aaaa-aaaai-qbcdq-cai\", 10_000_000:nat)"
(variant { 24_860 = 54 : nat })

# Transfer from current identity to one Principal ID on sonic
$ dfx canister --network ic call goeik-taaaa-aaaah-qcduq-cai transfer "(\"a7saq-3aaaa-aaaai-qbcdq-cai\", principal \"lkqmh-5vihe-t5x5j-smuot-vitei-tgfyx-losfh-bbud4-fp2rq-353dj-yqe\", 10_000_000:nat)"
(false)

# Create Pair
$ dfx canister --network ic call goeik-taaaa-aaaah-qcduq-cai createPair "(principal \"cfoim-fqaaa-aaaai-qbcmq-cai\", principal \"a7saq-3aaaa-aaaai-qbcdq-cai\")"
(variant { 24_860 = 55 : nat })

# Add Liquidity (token0: Principal, token1: Principal, amount0Desired: Nat, amount1Desired: Nat, amount0Min: Nat, amount1Min: Nat, deadline: Int)
# deadline = (new Date().getTime() + 5 * 60 * 1000) * 10000000
$ dfx canister --network ic call goeik-taaaa-aaaah-qcduq-cai addLiquidity "(principal \"cfoim-fqaaa-aaaai-qbcmq-cai\", principal \"a7saq-3aaaa-aaaai-qbcdq-cai\", 1_000_000_000:nat, 1_000_000_000:nat, 100_000_000:nat, 100_000_000:nat, 16390543510320000000)"
(variant { 24_860 = 56 : nat })