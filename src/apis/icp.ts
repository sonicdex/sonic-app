import BigNumber from 'bignumber.js';
import { principalToAccountIdentifier } from '../utils/common';
import RosettaApi from './rosetta';
import { ethers } from 'ethers';
import { parseUnits, formatUnits } from 'ethers/lib/utils';
import axios from 'axios';
import store from '../redux/store';

export const formatICP = (val: BigInt): string => {
  try {
    return new BigNumber(val.toString())
      .div(new BigNumber('100000000'))
      .toString();
  } catch (err) {
    return '0';
  }
};

export const formatAmount = (val: BigInt, decimals: number): string => {
  try {
    return formatUnits(ethers.BigNumber.from(val.toString()), decimals);
  } catch (err) {
    return '0';
  }
};

export const parseICP = (val: string): BigInt => {
  try {
    return parseAmount(val, 8);
  } catch (err) {
    return BigInt(0);
  }
};

export const parseAmount = (val: string, decimals: number): BigInt => {
  try {
    const str = parseUnits(val, decimals).toString();
    return BigInt(str);
  } catch (err) {
    return BigInt(0);
  }
};

export const getICPBalance = async (principal: string) => {
  let res = {
    status: 0,
    data: '',
    msg: '',
  };
  const { plugWallet } = store.getState();
  if (plugWallet.principal) {
    // @ts-ignore
    const result = await window?.ic.plug.requestBalance();
    const amount =
      result.find((balance) => balance.name === 'ICP')?.amount || 0;
    return {
      status: 1,
      data: String(amount),
      msg: '',
    };
  }
  const rosettaAPI = new RosettaApi();
  let promise = new Promise<{ status: number; data: string; msg: string }>(
    (resolve, reject) => {
      if (!principal) return resolve(res);
      rosettaAPI
        .getAccountBalance(principalToAccountIdentifier(principal || '', 0))
        .then((bal) => {
          res.status = 1;
          res.data = new BigNumber(bal.toString())
            .div(new BigNumber('100000000'))
            .toString();
          resolve(res);
        })
        .catch((err) => {
          res.msg = err.message;
          resolve(res);
        });
    }
  );
  return promise;
};

export const getICPPrice = () => {
  let promise = new Promise<string | undefined>((resolve, reject) => {
    axios
      .get('https://api.binance.com/api/v3/avgPrice?symbol=ICPUSDT')
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data?.price);
        } else {
          reject(false);
        }
      })
      .catch((err) => reject(err));
  });
  return promise;
};
