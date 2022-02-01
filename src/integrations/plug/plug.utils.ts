type RequestConnectArgs = {
  whitelist?: string[];
  host?: string;
};

export const plug = window.ic?.plug;

export const requestConnect = (args?: RequestConnectArgs) =>
  window.ic?.plug?.requestConnect(args);

export const checkIsConnected = () => window.ic?.plug?.isConnected();

export const getPrincipal = () => window.ic?.plug?.getPrincipal();

export const requestBalance = () => (window.ic?.plug as any)?.requestBalance();

export const disconnect = () => window.ic?.plug?.disconnect();

export const checkIfPlugProviderVersionCompatible = (version: number) => {
  const plugProviderVersionNumber = Number(
    plug?.versions.provider.split('.').join('')
  );

  if (plugProviderVersionNumber >= version) {
    return true;
  }

  return false;
};

export const executeIfPlugProviderVersionCompatible = (
  version: number,
  callback: () => void
) => {
  if (checkIfPlugProviderVersionCompatible(version)) {
    callback();
  }
};
