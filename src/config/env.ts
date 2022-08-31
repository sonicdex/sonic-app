export const ENV = {
  host: process.env.HOST || 'https://boundary.ic0.app/',
  analyticsHost:
    process.env.ANALYTICS_HOST || 'https://sonicapi.xyz/beta/graphql',
  swapCanisterFee: Number(process.env.SWAP_CANISTER_FEE) || 10000,
  isDarkModeEnabled: process.env.IS_DARK_MODE_ENABLED === 'true',
  canistersPrincipalIDs: {
    ledger: process.env.LEDGER_CANISTER_ID || 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    swap: process.env.SWAP_CANISTER_ID || '3xwpq-ziaaa-aaaah-qcn4a-cai',
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
    discord: process.env.DISCORD_URL || 'https://discord.com/invite/EkmnRd99h6',
    twitter: process.env.TWITTER_URL || 'https://twitter.com/sonic_ooo',
    medium: process.env.MEDIUM_URL || 'https://medium.com/@sonic-ooo',
    github: process.env.GITHUB_URL || 'https://github.com/psychedelic/sonic',
    sonicDocs: process.env.SONIC_DOCS_URL || 'https://docs.sonic.ooo',
    termsAndConditions:
      process.env.TERMS_AND_CONDITIONS_URL ||
      'https://docs.sonic.ooo/resources/disclaimer-terms',
    tokenRequestForm:
      process.env.TOKEN_REQUEST_FORM_URL ||
      'https://form.typeform.com/to/YnSyAUn0',
    analyticsApp: process.env.ANALYTICS_APP_URL || 'https://data.sonic.ooo',
    ledgerTransactions:
      process.env.LEDGER_TRANSACTIONS_URL || 'https://icscan.io/transaction',
  },

  hiddenTokens: (process.env.HIDDEN_TOKENS || '').split(','),
  maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
};
