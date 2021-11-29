type RequestConnectArgs = {
  whitelist?: string[];
  host?: string;
};

export const plug = window.ic.plug;

export const requestConnect = (args?: RequestConnectArgs) =>
  window.ic?.plug?.requestConnect(args);

export const checkIsConnected = () => window.ic?.plug?.isConnected();

export const getPrincipal = () => window.ic?.plug?.getPrincipal();

export const disconnect = () => window.ic?.plug?.disconnect();
