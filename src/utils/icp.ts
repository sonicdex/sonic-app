import BigNumber from 'bignumber.js';
import axios from 'axios';

import { principalToAccountIdentifier } from './common';
import RosettaApi from '@/apis/rosetta';
import { plug } from '@/integrations/plug';
import { useEffect, useState } from 'react';
import { usePlugStore } from '@/store';
import { parseAmount } from './format';
import { BINANCE_V3_API_URL } from '@/integrations/binance/constants';

export const formatICP = (val: BigInt): string => {
  try {
    return new BigNumber(val.toString())
      .div(new BigNumber('100000000'))
      .toString();
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

export const getICPBalance = (principalId: string) => {
  let res = {
    status: 0,
    data: '',
    msg: '',
  };

  const rosettaAPI = new RosettaApi();

  let promise = new Promise<{ status: number; data: string; msg: string }>(
    (resolve, reject) => {
      if (!principalId) return resolve(res);
      rosettaAPI
        .getAccountBalance(principalToAccountIdentifier(principalId || '', 0))
        .then((bal) => {
          res.status = 1;
          res.data = new BigNumber(bal.toString())
            .div(new BigNumber('100000000'))
            .toString();
          resolve(res);
        })
        .catch((err: any) => {
          res.msg = err.message;
          reject(res);
        });
    }
  );

  return promise;
};

export const useICPBalance = () => {
  const { principalId } = usePlugStore();
  const [balance, setBalance] = useState(BigInt(0));

  const getBalance = async () => {
    if (principalId) {
      const result = plug?.requestBalance();

      if (result) {
        // TODO: Fix types
        const balance =
          (result as unknown as any[]).find((balance) => balance.name === 'ICP')
            ?.amount || 0;

        setBalance(balance);
        return balance;
      }
    }
  };

  useEffect(() => {
    getBalance();
  }, [principalId]);

  return {
    balance,
    getBalance,
  };
};

export const getICPPrice = async () => {
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
