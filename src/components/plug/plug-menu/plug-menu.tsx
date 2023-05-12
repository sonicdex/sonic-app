import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { BiExit } from '@react-icons/all-files/bi/BiExit';
import { FaChevronDown } from '@react-icons/all-files/fa/FaChevronDown';
import { FiCopy } from '@react-icons/all-files/fi/FiCopy';
import { FC, useMemo } from 'react';

import { plugActions, walletState, useAppDispatch, useWalletStore } from '@/store';
import { copyToClipboard } from '@/utils';
import { desensitizationPrincipalId } from '@/utils/canister';

import { PlugLogo } from '..';

export const PlugMenu: FC<Omit<MenuProps, 'children'>> = (props) => {
  const { principalId, state } = useWalletStore();
  const dispatch = useAppDispatch();

  console.log(principalId);

  const handleDisconnect = async () => {
    dispatch(plugActions.disconnect());
  };

  const shortPrincipalId = useMemo(() => {
    return desensitizationPrincipalId(principalId);
  }, [principalId]);

  const handleCopy = () => {
    if (principalId) {
      copyToClipboard(principalId, 'Principal ID copied to clipboard');
    }
  };

  const bg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('base', 'none');

  return (
    <Menu {...props}>
      <MenuButton borderRadius="full" px="4" h="12" bg={bg} shadow={shadow}>
        <Flex direction="row" alignItems="center">
          {state === walletState.Loading ? <Spinner /> : <PlugLogo />}
          <Box ml="2" fontWeight={600}> {shortPrincipalId}</Box>
          <Icon as={FaChevronDown} ml={3} />
        </Flex>
      </MenuButton>
      <div>
        <MenuList bg={bg} shadow={shadow} borderRadius="xl" overflow="hidden">
          <MenuItem onClick={handleCopy} icon={<FiCopy />}>
            <Text>Copy ID</Text>
          </MenuItem>
          <MenuItem onClick={handleDisconnect} icon={<BiExit />}>
            <Text>Disconnect</Text>
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

PlugMenu.displayName = 'PlugPrincipalIDTag';
