import { ReactElement, FC, useMemo } from 'react';
import { TagProps } from '@chakra-ui/tag';
import { Spinner } from '@chakra-ui/spinner';
import {
  Flex,
  Box,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/react';

import { FeatureState, useAppDispatch, usePlugStore } from '@/store';
import { Emoji, GradientBox } from '@/components/core';
import { desensitizationPrincipalId } from '@/utils/canister';
import { chevronDownSrc, copySrc, exitSrc } from '@/assets';

const ChevronIcon = () => <Box ml="11px" as="img" src={chevronDownSrc} />;

export const PlugPrincipalIDTag: FC<TagProps> = ({
  ...props
}): ReactElement => {
  const { principalId, state, setIsConnected } = usePlugStore();
  const dispatch = useAppDispatch();

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const shortPrincipalId = useMemo(() => {
    return desensitizationPrincipalId(principalId);
  }, [principalId]);

  const mediumPrincipalId = useMemo(() => {
    return desensitizationPrincipalId(principalId, 11, 9);
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
      <MenuList
        p="0px"
        bg="#1E1E1E"
        borderWidth="0px"
        borderRadius="20px"
        overflow="hidden"
      >
        <MenuItem
          py="7px"
          pt="17px"
          px="19px"
          fontWeight={700}
          _hover={{
            bg: '#1E1E1E',
          }}
        >
          {mediumPrincipalId}
        </MenuItem>
        <MenuItem py="7px" px="19px" fontWeight={700} onClick={handleCopy}>
          <Flex direction="row">
            <Box as="img" src={copySrc} mr="12px" />
            Copy ID
          </Flex>
        </MenuItem>
        <MenuItem
          py="7px"
          pb="15px"
          px="19px"
          fontWeight={700}
          onClick={handleDisconnect}
        >
          <Flex direction="row">
            <Box as="img" src={exitSrc} mr="12px" />
            Disconnect
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

PlugPrincipalIDTag.displayName = 'PlugPrincipalIDTag';
