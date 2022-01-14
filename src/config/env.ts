export const ENV = {
  host: process.env.HOST || '',
  tokenRequestURL: 'https://form.typeform.com/to/YnSyAUn0',
  canisterIds: {
    ledger: process.env.LEDGER_CANISTER_ID || 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    swap: process.env.SWAP_CANISTER_ID || 'r444h-piaaa-aaaah-qcl3q-cai',
    nnsCycles:
      process.env.NNS_CYCLES_CANISTER_ID || 'rkp4c-7iaaa-aaaaa-aaaca-cai',
    WICP: process.env.WICP_CANISTER_ID || 'utozz-siaaa-aaaam-qaaxq-cai',
    XTC: process.env.XTC_CANISTER_ID || 'aanaa-xaaaa-aaaah-aaeiq-cai',
    swapCapRoot:
      process.env.SWAP_CAP_ROOT_CANISTER_ID || '3qxje-uqaaa-aaaah-qcn4q-cai',
  },
};
