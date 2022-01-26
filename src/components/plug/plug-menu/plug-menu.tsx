import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { FaChevronDown } from '@react-icons/all-files/fa/FaChevronDown';
import { FC, useMemo } from 'react';

import { copySrc, exitSrc } from '@/assets';
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

  const bg = useColorModeValue('white', 'custom.2');
  const shadow = useColorModeValue('sm', 'none');

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
      <MenuList
        bg={bg}
        shadow={shadow}
        border="none"
        borderRadius="xl"
        overflow="hidden"
      >
        <MenuItem fontWeight="bold" onClick={handleCopy}>
          <HStack direction="row">
            <Image alt="copy" src={copySrc} />
            <Text>Copy ID</Text>
          </HStack>
        </MenuItem>
        <MenuItem fontWeight="bold" onClick={handleDisconnect}>
          <HStack direction="row">
            <Image alt="exit" src={exitSrc} />
            <Text>Disconnect</Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

PlugMenu.displayName = 'PlugPrincipalIDTag';
