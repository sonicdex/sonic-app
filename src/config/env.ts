export const ENV = {
  host: process.env.HOST || '',
  canisters: [
    process.env.TOKEN_CANISTER_ID || '6u36y-tyaaa-aaaah-qaawq-cai',
    process.env.LEDGER_CANISTER_ID || 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    process.env.SWAP_CANISTER_ID || 'goeik-taaaa-aaaah-qcduq-cai',
    process.env.SWAP_STORAGE_CANISTER_ID || 'ghhdw-fiaaa-aaaah-qcdva-cai',
    process.env.WICP_CANISTER_ID || 'gagfc-iqaaa-aaaah-qcdvq-cai',
    process.env.XTC_CANISTER_ID || 'gvbup-jyaaa-aaaah-qcdwa-cai',
  ],
};
