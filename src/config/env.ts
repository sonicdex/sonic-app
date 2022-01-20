export const ENV = {
  host: process.env.HOST || 'https://boundary.ic0.app/',
  swapCanisterFee: Number(process.env.SWAP_CANISTER_FEE) || 10000,
  isDarkModeEnabled: process.env.IS_DARK_MODE_ENABLED === 'true',
  canistersPrincipalIDs: {
    ledger: process.env.LEDGER_CANISTER_ID || 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    swap: process.env.SWAP_CANISTER_ID || 'r444h-piaaa-aaaah-qcl3q-cai',
    cyclesMinting:
      process.env.CYCLES_MINTING_CANISTER_ID || 'rkp4c-7iaaa-aaaaa-aaaca-cai',
    WICP: process.env.WICP_CANISTER_ID || 'utozz-siaaa-aaaam-qaaxq-cai',
    XTC: process.env.XTC_CANISTER_ID || 'aanaa-xaaaa-aaaah-aaeiq-cai',
    swapCapRoot:
      process.env.SWAP_CAP_ROOT_CANISTER_ID || '3qxje-uqaaa-aaaah-qcn4q-cai',
  },
  accountIDs: {
    XTC:
      process.env.XTC_ACCOUNT_ID ||
      '758bdb7e54b73605d1d743da9f3aad70637d4cddcba03db13137eaf35f12d375',
    WICP:
      process.env.WICP_ACCOUNT_ID ||
      'cc659fe529756bae6f72db9937c6c60cf7ad57eb4ac5f930a75748927aab469a',
  },
  URLs: {
    termsAndConditions:
      process.env.TERMS_AND_CONDITIONS ||
      'https://discord.com/channels/@me/901137314187718727/933777677117173760',
    tokenRequestForm:
      process.env.TOKEN_REQUEST_FORM_URL ||
      'https://form.typeform.com/to/YnSyAUn0',
  },
};
