import { ReactElement, FC, useMemo } from 'react';
import { TagProps } from '@chakra-ui/tag';
import { Spinner } from '@chakra-ui/spinner';
import {
  Flex,
  HStack,
  Text,
  Image,
  Box,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/react';

import {
  FeatureState,
  plugActions,
  useAppDispatch,
  usePlugStore,
} from '@/store';
import { Emoji, GradientBox } from '@/components/core';
import { desensitizationPrincipalId } from '@/utils/canister';
import { chevronDownSrc, copySrc, exitSrc } from '@/assets';

export const PlugPrincipalIDTag: FC<TagProps> = (props): ReactElement => {
  const { principalId, state } = usePlugStore();
  const dispatch = useAppDispatch();

  const handleDisconnect = () => {
    dispatch(plugActions.setIsConnected(false));
  };

  const shortPrincipalId = useMemo(() => {
    return desensitizationPrincipalId(principalId);
  }, [principalId]);

  const handleCopy = () => {
    if (principalId) {
      navigator.clipboard.writeText(principalId);
    }
  };

  return (
    <Menu>
      <MenuButton borderRadius="full" px="4" h="12" bg="#1E1E1E">
        <Flex direction="row" alignItems="center">
          {state === FeatureState.Loading ? (
            <Spinner />
          ) : (
            <GradientBox>
              <Emoji label="Fire">🔥</Emoji>
            </GradientBox>
          )}
          <Box ml="2" fontWeight={600}>
            {shortPrincipalId}
          </Box>
          <ChevronIcon />
        </Flex>
      </MenuButton>
      <MenuList bg="#1E1E1E" border="none" borderRadius="xl" overflow="hidden">
        <MenuItem fontWeight="bold" onClick={handleCopy}>
          <HStack direction="row">
            <Image src={copySrc} />
            <Text>Copy ID</Text>
          </HStack>
        </MenuItem>
        <MenuItem fontWeight="bold" onClick={handleDisconnect}>
          <HStack direction="row">
            <Image src={exitSrc} />
            <Text>Disconnect</Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

PlugPrincipalIDTag.displayName = 'PlugPrincipalIDTag';

const ChevronIcon = () => <Image ml={3} src={chevronDownSrc} />;
