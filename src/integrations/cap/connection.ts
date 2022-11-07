import { CapRoot } from '@psychedelic/cap-js';

import { ENV } from '@/config';

export interface CapRouterInstanceProps {
  canisterId: string;
  host?: string;
}

export const getCapRootInstance = async ({
  canisterId,
  host = ENV.host,
}: CapRouterInstanceProps) =>
  await CapRoot.init({
    host,
    canisterId,
  });
