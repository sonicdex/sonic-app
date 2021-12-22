export const ENV = {
  host: process.env.HOST || '',
  canisterIds: {
    token: process.env.TOKEN_CANISTER_ID || '6u36y-tyaaa-aaaah-qaawq-cai',
    ledger: process.env.LEDGER_CANISTER_ID || 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    swap: process.env.SWAP_CANISTER_ID || 'r444h-piaaa-aaaah-qcl3q-cai',
    swapStorage:
      process.env.SWAP_STORAGE_CANISTER_ID || 'ghhdw-fiaaa-aaaah-qcdva-cai',
    WICP: process.env.WICP_CANISTER_ID || 'gagfc-iqaaa-aaaah-qcdvq-cai',
    XTC: process.env.XTC_CANISTER_ID || 'gvbup-jyaaa-aaaah-qcdwa-cai',
    swapCapRoot:
      process.env.SWAP_CAP_ROOT_CANISTER_ID || 'zdike-4iaaa-aaaah-qcnsa-cai',
  },
};
