import Provider from '@psychedelic/plug-inpage-provider';

type RequestConnectArgs = {
  whitelist?: string[];
  host?: string;
};

const isDev = process.env.NODE_ENV === 'development';
const ua = navigator.userAgent.toLowerCase();
const isAndroid = ua.indexOf('android') > -1;
const isiOs = ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1;

const isMobile = isAndroid || isiOs;

if (!window.ic?.plug && isMobile) {
  Provider.exposeProviderWithWalletConnect({ window, debug: isDev });
}

export const plug = window.ic?.plug;

export const requestConnect = (args?: RequestConnectArgs) =>
  window.ic?.plug?.requestConnect(args);

export const checkIsConnected = () => window.ic?.plug?.isConnected();

export const getPrincipal = () => window.ic?.plug?.getPrincipal();

export const requestBalance = () => (window.ic?.plug as any)?.requestBalance();

export const disconnect = () => window.ic?.plug?.disconnect();

export const checkIfPlugProviderVersionCompatible = (version = '1.6.0') => {
  if (!plug?.versions.provider) return false;

  const parseVersion = (v: string) =>
    v
      .replace(/([^(\d|.)]+)/gi, '')
      .split('.')
      .map(Number);

  const providerVersion = parseVersion(plug.versions.provider);
  const requiredVersion = parseVersion(version);

  for (let i = 0; i < requiredVersion.length; i++) {
    if (providerVersion[i] === undefined) providerVersion[i] = 0;
    if (requiredVersion[i] === undefined) requiredVersion[i] = 0;

    if (providerVersion[i] === requiredVersion[i]) {
      continue;
    } else if (providerVersion[i] > requiredVersion[i]) {
      return true;
    } else {
      return false;
    }
  }

  return true;
};
