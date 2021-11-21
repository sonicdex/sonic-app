export const ENV = {
  host: process.env.HOST || '',
  canisters: [
    process.env.LEDGER_CANISTER_ID || '',
    process.env.SWAP_CANISTER_ID || '',
    process.env.SWAP_STORAGE_CANISTER_ID || '',
    process.env.WICP_CANISTER_ID || '',
    process.env.XTC_CANISTER_ID || '',
  ],
};
