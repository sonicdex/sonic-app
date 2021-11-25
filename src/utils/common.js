/* global BigInt */
import { DelegationIdentity } from "@dfinity/identity";
import { getCrc32 } from "@dfinity/agent/lib/esm/utils/getCrc";
import * as SHA1 from "@dfinity/agent/lib/esm/utils/sha224";
import * as SHA2 from "js-sha256";
import { blobFromUint8Array, blobToHex, Principal } from "@dfinity/agent";
import crc32 from "crc-32";
import { GetAgent } from "./getAgent";
import {getSelectedAccount} from "./identity";

/**
 * @param {String} str - hex string
 * @returns
 */
export const getUint8ArrayFromHex = (str) => {
  return new Uint8Array(str.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
};

/**
 * Whether a principal is delegated from a delegation identity.
 * @param {*} principal -- the principal string to be checked
 * @param {*} delegationIdentityAccount
 * @returns -- true for yes, false for no.
 */
export const isDelegateByAccount = (principal, delegationIdentityAccount) => {
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
export const principalToAccountIdentifier = (principal, s) => {
  if (!principal) return "";
  const padding = Buffer("\x0Aaccount-id");
  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(principal).toBlob(),
    ...getSubAccountArray(s),
  ]);
  const hash = SHA1.sha224(array);
  const checksum = to32bits(getCrc32(hash));
  const array2 = new Uint8Array([...checksum, ...hash]);
  return toHexString(array2);
};
const getSubAccountArray = (s) => {
  return Array(28)
    .fill(0)
    .concat(to32bits(s ? s : 0));
};
const to32bits = (num) => {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};
const toHexString = (byteArray) => {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};

/**
 *
 * @param {BigInt} amount
 * @param {String} canisterPrincipalString
 * @returns
 */
export const topupCycles = async (amount, canisterPrincipalString) => {
  function buildSubAccountId(principal) {
    const blob = principal.toBlob();
    const subAccount = new Uint8Array(32);
    subAccount[0] = blob.length;
    subAccount.set(blob, 1);
    return subAccount;
  }
  function principalToAccountId(principal, subaccount) {
    const shaObj = SHA2.sha224.create();
    shaObj.update("\x0Aaccount-id");
    shaObj.update(principal.toBlob());
    shaObj.update(subaccount ? subaccount : new Uint8Array(32));
    const hash = new Uint8Array(shaObj.array());
    const crc = crc32.buf(hash);
    const blob = blobFromUint8Array(
      new Uint8Array([
        (crc >> 24) & 0xff,
        (crc >> 16) & 0xff,
        (crc >> 8) & 0xff,
        crc & 0xff,
        ...hash,
      ])
    );
    return blobToHex(blob);
  }
  let promise = new Promise(async (resolve, reject) => {
    if (!process.env.REACT_APP_CMINTING_CANISTER_ID)
      return reject({ message: "CMinting canister not found." });
    try {
      const minting_id = Principal.fromText(
        process.env.REACT_APP_CMINTING_CANISTER_ID
      );
      const to_subaccount = buildSubAccountId(
        Principal.fromText(canisterPrincipalString)
      );
      const account = principalToAccountId(minting_id, to_subaccount);
      let ledger = await GetAgent.ledgerActor();
      const block_height = await ledger.send_dfx({
        to: account,
        fee: { e8s: 0.0001 * 100000000 },
        memo: BigInt(0x50555054),
        from_subaccount: [],
        created_at_time: [],
        amount: { e8s: Number(amount) },
      });
      await ledger.notify_dfx({
        to_canister: minting_id,
        block_height,
        from_subaccount: [],
        to_subaccount: [[...to_subaccount]],
        max_fee: { e8s: 0.0001 * 100000000 },
      });
      resolve({ status: 1 });
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

export const checkMnemonic=(mne)=>{
  const english = require('bip39wordlist/english.json').list;
  for (const i of mne){
    if (!english.includes(i)){
       return  false;
    }
  }

 return  true;
}

export const toThousands =(num)=>{
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
