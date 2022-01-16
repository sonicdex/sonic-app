export const ENV = {
  host: process.env.HOST || 'https://boundary.ic0.app/',

  canistersPrincipalIDs: {
    ledger: process.env.LEDGER_CANISTER_ID || 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    swap: process.env.SWAP_CANISTER_ID || 'r444h-piaaa-aaaah-qcl3q-cai',
    nnsCycles:
      process.env.NNS_CYCLES_CANISTER_ID || 'rkp4c-7iaaa-aaaaa-aaaca-cai',
    WICP: process.env.WICP_CANISTER_ID || 'utozz-siaaa-aaaam-qaaxq-cai',
    XTC: process.env.XTC_CANISTER_ID || 'aanaa-xaaaa-aaaah-aaeiq-cai',
    swapCapRoot:
      process.env.SWAP_CAP_ROOT_CANISTER_ID || '3qxje-uqaaa-aaaah-qcn4q-cai',
  },
  accountIDs: {
    XTC:
      process.env.XTC_ACCOUNT_ID ||
      '7e968a04a6714e9f5bca8cbb0117d97279fd2f917b292a92f514599e38ec742f',
    WICP:
      process.env.WICP_ACCOUNT_ID ||
      'cc659fe529756bae6f72db9937c6c60cf7ad57eb4ac5f930a75748927aab469a',
  },
  URLs: {
    tokenRequestForm:
      process.env.TOKEN_REQUEST_FORM_URL ||
      'https://form.typeform.com/to/YnSyAUn0',
  },
};
