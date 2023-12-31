
import { Pair, toBigNumber } from '@sonicdex/sonic-js';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { AppTokenMetadata } from '@/models';

export type BigNumberish = BigNumber | bigint | string | number;

//BigNumber.config({ EXPONENTIAL_AT: 99 });
BigNumber.config({ EXPONENTIAL_AT: 99 });

export const parseAmount = (val: string, decimals: string | number): bigint => {
  try {
    const fixedVal = new BigNumber(val).toFixed(Number(decimals)); // Fix for scientific notation string
    const str = parseUnits(fixedVal, decimals).toString();
    return BigInt(str);
  } catch (err) {
    return BigInt(0);
  }
};
export const roundBigInt = ( val:BigInt ,actualDecimals:string | number, roundOfdecimals:number= 5): bigint =>{
  try {
    var ad:number = parseInt(actualDecimals.toString());
    var roundedNumber =  (Math.floor( (Number(val) / 10 ** ad) *(10**roundOfdecimals))/(10**roundOfdecimals)).toString();
    var tmp:number = parseFloat(roundedNumber)*(10**ad);
    tmp=Number(tmp.toFixed(0))
    return BigInt(tmp);
  }catch (err) {
    return BigInt(0);
  }
}


export const formatValue = (
  val: BigInt | number | string,
  decimals: number
): string => {
  try {
    return formatUnits(ethers.BigNumber.from(val.toString()), decimals);
  } catch (err) {
    return '0';
  }
};

export type GetValueWithoutFeesOptions = {
  value: string;
  fee: bigint;
  decimals: number;
  numberOfFees?: number;
};

export const getValueWithoutFees = ({
  value,
  fee,
  decimals,
  numberOfFees = 1,
}: GetValueWithoutFeesOptions) => {
  const _value = new BigNumber(value);
  const _feesAmount = toBigNumber(numberOfFees * Number(fee)).applyDecimals(
    decimals
  );

  return _value.minus(_feesAmount);
};

export const getMaxValue = ( token?: AppTokenMetadata, balance?: number | bigint, isTransfer:boolean=false ): BigNumber => {
  if (!token || !balance) return new BigNumber(0);
  var times = 1;
  var tokenType = token.tokenType?.toLowerCase();
  if(tokenType =='icrc1' || tokenType =='dip20' || tokenType =='icrc2' ){
    times = 2;
  }
  if(isTransfer){ times = 1;}
  
  const value = toBigNumber(Number(balance)).minus(Number(token.fee) * times);

  if (value.isNegative() || value.isZero()) {
    return new BigNumber(0);
  }

  return value.applyDecimals(token.decimals);
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getPairIdsFromPairList = (pairList: Pair.List ): string[] => {
  const idsSet = new Set<string>();
  Object.values(pairList).forEach((paired) => {
    Object.values(paired).forEach((pair) => {
      idsSet.add(pair.id);
    });
  });
  return Array.from(idsSet);
};

export const getUserPailListFromPairList =  (pairList: Pair.List, principalId?:any ): string[] => {
  const idsSet = new Set<string>();
  Object.values(pairList).forEach( paired=>{
    Object.values(paired).forEach(pair=>{
      if(pair?.creator.toString() == principalId) idsSet.add(pair.id);
    })
})
  return Array.from(idsSet);
}