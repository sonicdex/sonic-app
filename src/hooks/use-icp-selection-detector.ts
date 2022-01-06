import { useMemo } from 'react';

import { ICP_METADATA } from '@/constants';

export const useICPSelectionDetectorMemo = (id0?: string, id1?: string) =>
  useMemo(() => {
    if (id0 === ICP_METADATA.id) {
      return {
        isICPSelected: true,
        isFirstTokenIsICP: true,
        isSecondTokenIsICP: false,
      };
    }

    if (id1 === ICP_METADATA.id) {
      return {
        isICPSelected: true,
        isFirstTokenIsICP: false,
        isSecondTokenIsICP: true,
      };
    }

    return {
      isICPSelected: false,
      isFirstTokenIsICP: false,
      isSecondTokenIsICP: false,
    };
  }, [id0, id1]);
