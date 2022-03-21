import { Principal } from '@dfinity/principal';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import crc32 from 'buffer-crc32';
import CryptoJS from 'crypto-js';

import RosettaApi from '@/apis/rosetta';
import { BINANCE_V3_API_URL } from '@/integrations/binance/constants';

export const ACCOUNT_DOMAIN_SEPERATOR = '\x0Aaccount-id';

export const fetchICPBalance = async (principalId: string) => {
  const accountId = getAccountId(Principal.fromText(principalId || ''), 0);

  if (accountId) {
    const rosettaAPI = new RosettaApi();

    const balance = await rosettaAPI.getAccountBalance(accountId);

    const icpBalanceNoDecimals = new BigNumber(balance.toString())
      .div(new BigNumber('100000000'))
      .toString();

    return icpBalanceNoDecimals;
  } else {
    throw new Error('Account ID is required');
  }
};

export const fetchICPPrice = async () => {
  try {
    const response = await axios.get(
      `${BINANCE_V3_API_URL}/avgPrice?symbol=ICPUSDT`
    );

    if (response.status === 200) {
      return response.data.price;
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw new Error((error as any).message);
  }
};

/*
    Used dfinity/keysmith/account/account.go as a base for the ID generation
*/
export const getAccountId = (
  principal: Principal,
  subAccount?: number
): string => {
  const sha = CryptoJS.algo.SHA224.create();
  sha.update(ACCOUNT_DOMAIN_SEPERATOR); // Internally parsed with UTF-8, like go does
  sha.update(byteArrayToWordArray(principal.toUint8Array()));

  const SUB_ACCOUNT_ZERO = Buffer.alloc(32);

  const subBuffer = Buffer.from(SUB_ACCOUNT_ZERO);
  if (subAccount) {
    subBuffer.writeUInt32BE(subAccount);
  }
  sha.update(byteArrayToWordArray(subBuffer));
  const hash = sha.finalize();

  /// While this is backed by an array of length 28, it's canonical representation
  /// is a hex string of length 64. The first 8 characters are the CRC-32 encoded
  /// hash of the following 56 characters of hex. Both, upper and lower case
  /// characters are valid in the input string and can even be mixed.
  /// [ic/rs/rosetta-api/ledger_canister/src/account_identifier.rs]
  const byteArray = wordArrayToByteArray(hash, 28);
  const checksum = generateChecksum(byteArray);
  const val = checksum + hash.toString();

  return val;
};

const byteArrayToWordArray = (byteArray: Uint8Array) => {
  const wordArray = [] as any;
  let i;
  for (i = 0; i < byteArray.length; i += 1) {
    wordArray[(i / 4) | 0] |= byteArray[i] << (24 - 8 * i);
  }
  // eslint-disable-next-line
  const result = CryptoJS.lib.WordArray.create(wordArray, byteArray.length);
  return result;
};

const wordToByteArray = (word: number, length: number): number[] => {
  const byteArray: number[] = [];
  const xFF = 0xff;
  if (length > 0) byteArray.push(word >>> 24);
  if (length > 1) byteArray.push((word >>> 16) & xFF);
  if (length > 2) byteArray.push((word >>> 8) & xFF);
  if (length > 3) byteArray.push(word & xFF);

  return byteArray;
};

const wordArrayToByteArray = (wordArray: any, length: number) => {
  if (
    wordArray.hasOwnProperty('sigBytes') &&
    wordArray.hasOwnProperty('words')
  ) {
    length = wordArray.sigBytes;
    wordArray = wordArray.words;
  }

  let result: any = [];
  let bytes;
  let i = 0;
  while (length > 0) {
    bytes = wordToByteArray(wordArray[i], Math.min(4, length));
    length -= bytes.length;
    result = [...result, bytes];
    i++;
  }
  return [].concat(...result) as unknown as Uint8Array;
};

export const intToHex = (val: number) =>
  val < 0 ? (Number(val) >>> 0).toString(16) : Number(val).toString(16);

// We generate a CRC32 checksum, and trnasform it into a hexString
export const generateChecksum = (hash: Uint8Array) => {
  const crc = crc32.unsigned(Buffer.from(hash));
  const hex = intToHex(crc);
  return hex.padStart(8, '0');
};
