import { ICP_METADATA } from '@/constants';

export type UseTokenSelectionCheckerOptions = {
  id0?: string;
  id1?: string;
  targetId?: string;
};

export type UseTokenSelectionCheckerReturn = ReturnType<
  typeof useTokenSelectionChecker
>;

export const useTokenSelectionChecker = ({
  id0,
  id1,
  targetId = ICP_METADATA.id,
}: UseTokenSelectionCheckerOptions) => {
  const isFirstIsSelected = id0 === targetId;
  const isSecondIsSelected = id1 === targetId;

  return {
    isFirstIsSelected,
    isSecondIsSelected,
    isTokenSelected: isFirstIsSelected || isSecondIsSelected,
  };
};
