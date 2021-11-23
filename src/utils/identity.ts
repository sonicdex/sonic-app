import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { getUint8ArrayFromHex, principalToAccountIdentifier } from './common';
import { hdkey } from 'ethereumjs-wallet';
import { DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import { DfinitySubAccount, Ed25519Account } from '@/types/global';
import { AES, enc } from 'crypto-js';
import store from '../redux/store';
import { JsonnableEd25519KeyIdentity } from '@dfinity/identity/lib/cjs/identity/ed25519';
import { AuthClient } from '@dfinity/auth-client';
import { II } from '../redux/features/dfinityIdentity';
import storage from '../utils copy/storage';
export const addSubAccountFromDfinityIdentity = (
  principal: string,
  index: number
): DfinitySubAccount => {
  let aid = principalToAccountIdentifier(principal, index);
  let subAccount = {
    type: 'DfinitySubAccount',
    name: `Account ${index}`,
    aid,
    index,
  };
  return subAccount;
};

export const createNewWallet = (): {
  mnemonic: string;
  account: Ed25519Account;
} => {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet = hdwallet.derivePath("m/44'/223'/0'").getWallet();
  const privateKey = wallet.getPrivateKey();
  let arr = Array.from(privateKey);
  arr = arr.splice(0, 32);
  const secret = new Uint8Array(arr);
  const keyIdentity = Ed25519KeyIdentity.generate(secret);
  const principal = keyIdentity.getPrincipal().toString();
  const aid = principalToAccountIdentifier(principal, 0);
  const keys = keyIdentity.toJSON();

  const account = {
    type: 'Ed25519KeyIdentity',
    name: 'Main',
    aid,
    principal,
    publicKey: keys[0],
    keys,
    index: 0,
  };

  return { mnemonic, account };
};

export const importHDWallet = (mnemonic: string): Ed25519Account => {
  const seed = mnemonicToSeedSync(mnemonic);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet = hdwallet.derivePath("m/44'/223'/0'").getWallet();
  const privateKey = wallet.getPrivateKey();
  let arr = Array.from(privateKey);
  arr = arr.splice(0, 32);
  const secret = new Uint8Array(arr);
  const keyIdentity = Ed25519KeyIdentity.generate(secret);
  const principal = keyIdentity.getPrincipal().toString();
  const aid = principalToAccountIdentifier(principal, 0);
  const keys = keyIdentity.toJSON();

  return {
    type: 'Ed25519KeyIdentity',
    name: 'Main',
    aid,
    principal,
    publicKey: keys[0],
    keys,
    index: 0,
  };
};

export const addSubAccountFromMnemonic = (
  mnemonic: string,
  index: number
): Ed25519Account => {
  const seed = mnemonicToSeedSync(mnemonic);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet = hdwallet.derivePath(`m/44'/223'/${index}'`).getWallet();
  const privateKey = wallet.getPrivateKey();
  let arr = Array.from(privateKey);
  arr = arr.splice(0, 32);
  const secret = new Uint8Array(arr);
  const keyIdentity = Ed25519KeyIdentity.generate(secret);
  const principal = keyIdentity.getPrincipal().toString();
  const aid = principalToAccountIdentifier(principal, 0);
  const keys = keyIdentity.toJSON();
  return {
    type: 'Ed25519KeyIdentity',
    name: `Account ${index}`,
    aid,
    principal,
    publicKey: keys[0],
    keys,
    index,
  };
};

export const createAccountFromPrivateKey = (
  privateKey: string
): Ed25519Account => {
  const keyIdentity = Ed25519KeyIdentity.fromSecretKey(
    getUint8ArrayFromHex(privateKey)
  );
  const principal = keyIdentity.getPrincipal().toString();
  const aid = principalToAccountIdentifier(principal, 0);
  const keys = keyIdentity.toJSON();
  return {
    type: 'Imported',
    name: 'Imported',
    aid,
    principal,
    publicKey: keys[0],
    keys,
    index: -1,
  };
};

export const getInitDfinitySubAccounts = (): DfinitySubAccount[] => {
  return JSON.parse(localStorage.getItem('DSAs') || '[]');
};

export const getInitHdWallets = (password: string): Ed25519Account[] => {
  let encryptedWallets: string[] = JSON.parse(
    localStorage.getItem('Wallets') || '[]'
  );
  let arr = encryptedWallets.map((i) =>
    JSON.parse(AES.decrypt(i, password).toString(enc.Utf8))
  );
  return arr;
};

export const getInitImportedAccounts = (password: string): Ed25519Account[] => {
  let encryptedWallets: string[] = JSON.parse(
    localStorage.getItem('Imported') || '[]'
  );
  let arr = encryptedWallets.map((i) =>
    JSON.parse(AES.decrypt(i, password).toString(enc.Utf8))
  );
  return arr;
};

export const getSelectedAccount = (): {
  type: string;
  name: string;
  principal: string;
  aid: string;
  index: number;
  keys?: JsonnableEd25519KeyIdentity;
  isImported?: boolean;
} | null => {
  const state = store.getState();
  const {
    selected, // public key
    selectedIndex,
    dfinityIdentity,
    dfinitySubAccounts,
    hdWallets,
    importedAccounts,
    plugWallet,
  } = state;
  if (!selected) return null;
  if (dfinityIdentity && selected === dfinityIdentity.publicKey) {
    try {
      if (
        dfinityIdentity.identity &&
        dfinityIdentity.identity.getPrincipal().toString()
      ) {
        return {
          type: 'DelegationIdentity',
          name: dfinitySubAccounts[selectedIndex].name,
          principal: dfinityIdentity.identity.getPrincipal().toString(),
          aid: principalToAccountIdentifier(
            dfinityIdentity.identity.getPrincipal().toString(),
            selectedIndex
          ),
          index: 1,
        };
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  } else if (hdWallets.find((i) => i.publicKey === selected)) {
    const val = hdWallets.find((i) => i.publicKey === selected);
    return {
      type: 'Ed25519KeyIdentity',
      name: val?.name || '',
      principal: val?.principal || '',
      aid: principalToAccountIdentifier(val?.principal || '', 0),
      index: selectedIndex,
      keys: val?.keys,
    };
  } else if (importedAccounts.find((i) => i.publicKey === selected)) {
    const val = importedAccounts.find((i) => i.publicKey === selected);
    return {
      type: 'Ed25519KeyIdentity',
      name: val?.name || '',
      principal: val?.principal.toString() || '',
      aid: principalToAccountIdentifier(val?.principal || '', 0),
      index: selectedIndex,
      keys: val?.keys,
      isImported: true,
    };
  } else if (plugWallet.principal) {
    return {
      type: 'plugWallet',
      name: 'plugWallet',
      principal: plugWallet.principal.toString(),
      aid: principalToAccountIdentifier(plugWallet?.principal || '', 0),
      index: selectedIndex | 0,
    };
  } else {
    return null;
  }
};

export const getValidIdentityOnMount = async (): Promise<{
  dfinityIdentity?: II;
  requirePwd?: boolean;
}> => {
  let dfinityIdentity, requirePwd;

  // const selected = localStorage.getItem("selected");
  // if (!selected) return { dfinityIdentity, requirePwd };

  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  if (
    identity instanceof DelegationIdentity &&
    identity.getPrincipal().toString()
  ) {
    const keys: JsonnableEd25519KeyIdentity = JSON.parse(
      localStorage.getItem('ic-identity') || '[]'
    );
    dfinityIdentity = {
      identity,
      principal: identity.getPrincipal().toString(),
      publicKey: keys[0],
      keys,
    };
  }

  if (
    JSON.parse(localStorage.getItem('Wallets') || '[]').length > 0 ||
    JSON.parse(localStorage.getItem('Imported') || '[]').length > 0
  ) {
    requirePwd = true;
  }

  return { dfinityIdentity, requirePwd };
};

export const accountChecker = (): NodeJS.Timeout | any => {
  const unprotected = [
    '#/',
    '#/signin',
    '#/createhdwallet',
    '#/importhdwallet',
    '#/block',
  ];
  return setInterval(() => {
    if (unprotected.includes(window.location.hash)) return;
    let theOne = getSelectedAccount();
    if (!theOne || !theOne.principal) {
      window.location.replace('/');
      AuthClient.create().then((res) => res.logout());
    }
  }, 2000);
};
