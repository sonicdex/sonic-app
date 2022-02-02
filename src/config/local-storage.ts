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
    console.error(error);
    return undefined;
  }
}

export function saveToStorage(key: LocalStorageKey | string, value: any): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(error);
  }
}

export function removeFromStorage(key: LocalStorageKey | string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
}
