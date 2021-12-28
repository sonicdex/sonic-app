import { chevronDownSrc, copySrc, exitSrc } from '@/assets';
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
import {
  Box,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { TagProps } from '@chakra-ui/tag';
import { FC, ReactElement, useMemo } from 'react';
import { PlugLogo } from '..';

export const PlugPrincipalIDTag: FC<TagProps> = (props): ReactElement => {
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

  return (
    <Menu>
      <MenuButton borderRadius="full" px="4" h="12" bg="#1E1E1E">
        <Flex direction="row" alignItems="center">
          {state === FeatureState.Loading ? <Spinner /> : <PlugLogo />}
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
