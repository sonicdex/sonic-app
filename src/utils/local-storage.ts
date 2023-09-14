import { serialize } from '@sonicdex/sonic-js';

import { AppLog } from '@/utils';

export enum LocalStorageKey {
  Logos = 'logos',
  LiquidityBannerDisabled = 'liquidityBannerDisabled',
  AssetsBannerDisabled = 'assetsBannerDisabled',
  TermsAndConditionsAccepted = 'termsAndConditionsAccepted',

  MintWICPUncompleteBlockHeights = 'mintWICPUncompleteBlockHeights',
  MintXTCUncompleteBlockHeights = 'mintXTCUncompleteBlockHeights',
}

export type MintUncompleteBlockHeights = {
  [principalId: string]: string[];
};

export function getFromStorage(key: LocalStorageKey | string): any | undefined {
  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : undefined;
  } catch (error) {
    AppLog.warn(`Failed to get from storage: key=${key}`, error);
    return undefined;
  }
}

export function saveToStorage(key: LocalStorageKey | string, value: any): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    AppLog.warn(
      `Failed to save to storage: key=${key} value=${serialize(value)}`,
      error
    );
  }
}

export function removeFromStorage(key: LocalStorageKey | string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    AppLog.warn(`Failed to remove from storage: key=${key}`, error);
  }
}
