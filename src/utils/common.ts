// @ts-nocheck
import { DelegationChain, DelegationIdentity } from '@dfinity/identity';
import { Principal } from '@dfinity/principal';

/**
 * @param {String} str - hex string
 * @returns
 */
export const getUint8ArrayFromHex = (str: string) => {
  return new Uint8Array(str.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
};

/**
 * Whether a principal is delegated from a delegation identity.
 * @param {*} principal -- the principal string to be checked
 * @param {*} delegationIdentityAccount
 * @returns -- true for yes, false for no.
 */
export const isDelegateByAccount = (
  principal: Principal,
  delegationIdentityAccount: DelegationChain
) => {
  const publicKey = DelegationIdentity.fromDelegation(
    principal,
    delegationIdentityAccount.delegationChain
  )
    .getPublicKey()
    .toDer();
  return publicKey === delegationIdentityAccount.publicKey;
};

/**
 *
 * @param {string} principal
 * @param {*} s
 * @returns
 */
export const principalToAccountIdentifier = (
  principalId: string,
  s: number
) => {
  if (!principalId) return '';
  const padding = new Buffer('\x0Aaccount-id');
  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(principalId).toUint8Array(),
    ...getSubAccountArray(s),
  ]);
  const hash = SHA1.sha224(array);
  const checksum = to32bits(getCrc32(hash));
  const array2 = new Uint8Array([...checksum, ...hash]);
  return toHexString(array2);
};

const getSubAccountArray = (s: number) => {
  return Array(28)
    .fill(0)
    .concat(to32bits(s ? s : 0));
};

const to32bits = (num: number) => {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

const toHexString = (byteArray: Uint8Array) => {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
};
