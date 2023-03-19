import { ENV } from '@/config';

export abstract class ExternalLink {
  static readonly discord = ENV.URLs.discord;

  static readonly twitter = ENV.URLs.twitter;

  static readonly medium = ENV.URLs.medium;

  static readonly github = ENV.URLs.github;

  static readonly sonicDocs = ENV.URLs.sonicDocs;

  static readonly swapApiDocs = `${ENV.URLs.sonicDocs}/dev/swaps-api`;

  static readonly failedMintDocs = `${ENV.URLs.sonicDocs}/product/swap/failed-swaps#failed-mints`;

  static readonly termsAndConditions = ENV.URLs.termsAndConditions;

  static readonly tokenRequestForm = ENV.URLs.tokenRequestForm;

  static readonly analyticsApp = ENV.URLs.analyticsApp;

  static readonly icpPrice = "https://api.binance.com/api/v3/avgPrice?symbol=ICPUSDT" //`https://api.binance.com/api/v3/avgPrice?symbol=ICPUSDT`; https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd&precision=4

  static ledgerTransaction(transaction: string): ExternalLink.URL {
    return `${ENV.URLs.ledgerTransactions}/${transaction}`;
  }

  static capTransaction(transaction: string): ExternalLink.URL {
    return `https://explorer.cap.ooo/app-transactions/${ENV.canistersPrincipalIDs.swap}/${transaction}`;
  }
}

export namespace ExternalLink {
  export type URL = string;
}
