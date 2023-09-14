import { toBigNumber } from '@sonicdex/sonic-js';

import { MintTokenSymbol } from '@/store';
import {  
  getFromStorage, LocalStorageKey,  MintUncompleteBlockHeights, saveToStorage,
} from '@/utils';

export const getAmountDependsOnBalance = ( tokenBalance: number,tokenDecimals: number, fromValue: string): string => {
  const parsedFromValue = parseFloat(fromValue);
  const parsedTokenBalance = toBigNumber(tokenBalance).applyDecimals(tokenDecimals).toNumber();

  return (parsedFromValue - parsedTokenBalance).toString();
};


export type GetTransactionNameOptions = {
  tokenSymbol: MintTokenSymbol;
  blockHeight: string;
};

export function getTransactionName({
  tokenSymbol,
  blockHeight,
}: GetTransactionNameOptions) {
  return `${tokenSymbol}-${blockHeight}`;
}

export type SaveBlockHeightToStorageOptions = {
  blockHeight?: bigint;
  principalId?: string;
  tokenSymbol: MintTokenSymbol;
};

// === Block Heights ===

export type RemoveBlockHeightFromStorageOptions = {
  blockHeight: string;
  principalId?: string;
  tokenSymbol: MintTokenSymbol;
};

export const removeBlockHeightFromStorage = ({
  blockHeight,
  principalId,
  tokenSymbol,
}: RemoveBlockHeightFromStorageOptions) => {
  if (!principalId) {
    return null;
  }

  const localStorageKey =
    tokenSymbol === MintTokenSymbol.XTC
      ? LocalStorageKey.MintXTCUncompleteBlockHeights
      : LocalStorageKey.MintWICPUncompleteBlockHeights;

  const totalBlockHeights = getFromStorage(localStorageKey) as
    | MintUncompleteBlockHeights
    | undefined;
  const userBlockHeights = totalBlockHeights?.[principalId];

  if (userBlockHeights && userBlockHeights.length > 0) {
    const newBlockHeights = userBlockHeights.filter(
      (_blockHeight: string) => _blockHeight !== blockHeight
    );

    saveToStorage(localStorageKey, {
      ...totalBlockHeights,
      [principalId]: newBlockHeights,
    });
  }
};

export const saveBlockHeightToStorage = ({
  blockHeight,
  principalId,
  tokenSymbol,
}: SaveBlockHeightToStorageOptions) => {
  
  if (!principalId || !blockHeight) { return null;}

  const localStorageKey =
    tokenSymbol === MintTokenSymbol.XTC
      ? LocalStorageKey.MintXTCUncompleteBlockHeights
      : LocalStorageKey.MintWICPUncompleteBlockHeights;

  const prevMintWICPBlockHeight = getFromStorage(localStorageKey);

  const newBlockHeights = {
    ...prevMintWICPBlockHeight,
    [principalId]: [
      ...(prevMintWICPBlockHeight?.[principalId] || []),
      String(blockHeight),
    ],
  };

  saveToStorage(localStorageKey, newBlockHeights);
};

export const updateFailedBlockHeight = ({prevResponses,...props}: Omit<SaveBlockHeightToStorageOptions, 'blockHeight'> & {
  prevResponses: any[];
}) => {
  const failedBlockHeight = prevResponses?.[0]?.response as bigint | undefined;

  saveBlockHeightToStorage({ blockHeight: failedBlockHeight, ...props });
};
