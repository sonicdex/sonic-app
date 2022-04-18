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

import { disconnect } from '@/integrations/plug';
import {
  FeatureState,
  NotificationType,
  plugActions,
  useAppDispatch,
  useNotificationStore,
  usePlugStore,
} from '@/store';
import { desensitizationPrincipalId } from '@/utils/canister';

import { PlugLogo } from '..';

export const PlugMenu: FC<Omit<MenuProps, 'children'>> = (props) => {
  const { principalId, state } = usePlugStore();
  const { addNotification } = useNotificationStore();
  const dispatch = useAppDispatch();

  const handleDisconnect = async () => {
    dispatch(plugActions.setIsConnected(false));

    await disconnect();
  };

  const shortPrincipalId = useMemo(() => {
    return desensitizationPrincipalId(principalId);
  }, [principalId]);

  const handleCopy = () => {
    if (principalId) {
      navigator.clipboard.writeText(principalId);
      addNotification({
        id: String(new Date().getTime()),
        title: 'Principal ID copied to clipboard',
        type: NotificationType.Success,
      });
    }
  };

  const bg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('base', 'none');

  return (
    <Menu {...props}>
      <MenuButton borderRadius="full" px="4" h="12" bg={bg} shadow={shadow}>
        <Flex direction="row" alignItems="center">
          {state === FeatureState.Loading ? <Spinner /> : <PlugLogo />}
          <Box ml="2" fontWeight={600}>
            {shortPrincipalId}
          </Box>
          <Icon as={FaChevronDown} ml={3} />
        </Flex>
      </MenuButton>
      <MenuList bg={bg} shadow={shadow} borderRadius="xl" overflow="hidden">
        <MenuItem onClick={handleCopy} icon={<FiCopy />}>
          <Text>Copy ID</Text>
        </MenuItem>
        <MenuItem onClick={handleDisconnect} icon={<BiExit />}>
          <Text>Disconnect</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

PlugMenu.displayName = 'PlugPrincipalIDTag';
