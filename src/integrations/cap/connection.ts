import { ENV } from '@/config';
import { CapRoot } from '@psychedelic/cap-js';

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
