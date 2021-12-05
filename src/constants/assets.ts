import { wicpSrc, icpSrc, xtcSrc } from '@/assets';
import { SupportedToken } from '@/models';

export const TOKEN: Record<string, Partial<SupportedToken>> = {
  WICP: {
    name: 'WICP',
    logo: wicpSrc,
  },
  ICP: {
    name: 'ICP',
    logo: icpSrc,
  },
  XTC: {
    name: 'XTC',
    logo: xtcSrc,
  },
};
