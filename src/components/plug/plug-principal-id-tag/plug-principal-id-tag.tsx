import { forwardRef, useMemo } from 'react';
import { Tag, TagProps } from '@chakra-ui/tag';
import { Spinner } from '@chakra-ui/spinner';
import { TagCloseButton, TagLabel } from '@chakra-ui/react';

import { disconnect } from '@/integrations/plug';
import { FeatureState, useAppDispatch, usePlugStore } from '@/store';
import { DUMMY_PRINCIPAL_ID } from '@/config';
import { Emoji, GradientBox } from '@/components/core';
import { desensitizationPrincipalId } from '@/utils/canister';

type PlugPrincipalIDTagProps = TagProps;

export const PlugPrincipalIDTag = forwardRef<
  HTMLDivElement,
  PlugPrincipalIDTagProps
>(({ children, ...props }, ref) => {
  const { principalId, state, setIsConnected } = usePlugStore();
  const dispatch = useAppDispatch();

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const desensitizedPrincipalId = useMemo(() => {
    const result = desensitizationPrincipalId(
      principalId ?? DUMMY_PRINCIPAL_ID
    );

    return result;
  }, [principalId]);

  const onClick = async () => {
    handleDisconnect();

    await disconnect();
  };

  return (
    <Tag ref={ref} {...props} borderRadius="full" px="4" h="12" size="lg">
      {state === FeatureState.Loading ? (
        <Spinner />
      ) : (
        <GradientBox>
          <Emoji label="Fire">🔥</Emoji>
        </GradientBox>
      )}
      <TagLabel ml="2">{desensitizedPrincipalId}</TagLabel>
      <TagCloseButton onClick={onClick} />
    </Tag>
  );
});

PlugPrincipalIDTag.displayName = 'PlugPrincipalIDTag';
