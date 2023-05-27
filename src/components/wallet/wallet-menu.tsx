import {
  Box, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, MenuProps, Text,
  useColorModeValue, Image
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

import { Spinner } from '@chakra-ui/spinner';
import { BiExit } from '@react-icons/all-files/bi/BiExit';
import { FaChevronDown } from '@react-icons/all-files/fa/FaChevronDown';
import { FiCopy } from '@react-icons/all-files/fi/FiCopy';
import { FaExchangeAlt } from '@react-icons/all-files/fa/FaExchangeAlt';
import { FC, useMemo } from 'react';

import { walletState, useAppDispatch, useWalletStore, walletActions } from '@/store';
import { copyToClipboard } from '@/utils';
import { desensitizationPrincipalId } from '@/utils/canister';

import { artemis } from '@/integrations/artemis';

export const WalletMenu: FC<Omit<MenuProps, 'children'>> = (props) => {
  const navigate = useNavigate();

  const { principalId, state, accountId } = useWalletStore();
  const dispatch = useAppDispatch();

  const iconUrl = artemis?.connectedWalletInfo.icon;

  const handleDisconnect = async () => {
    await artemis.disconnect();
    await dispatch(walletActions.resetWallet());
    location.reload();
  };

  const shortPrincipalId = useMemo(() => {
    return desensitizationPrincipalId(principalId);
  }, [principalId]);
  const shortaccountId = useMemo(() => {
    return desensitizationPrincipalId(accountId);
  }, [accountId]);

  const handleCopy = (type: string = 'princ') => {
    if (type == 'princ') {
      if (principalId) {
        copyToClipboard(principalId, 'Principal ID copied to clipboard');
      }
    } else if (type == 'acnt') {
      if (accountId) {
        copyToClipboard(accountId, 'Account ID copied to clipboard');
      }
    }

  };

  const bg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('base', 'none');

  return (
    <Menu {...props}>
      <MenuButton borderRadius="full" px="4" h="12" bg={bg} shadow={shadow}>
        <Flex direction="row" alignItems="center">
          {state === walletState.Loading ? <Spinner /> : <Image src={iconUrl} borderRadius='full' boxSize='20px' />}
          <Box ml="2" fontWeight={600}> {shortPrincipalId}</Box>
          <Icon as={FaChevronDown} ml={3} />
        </Flex>
      </MenuButton>
      <div>
        <MenuList bg={bg} shadow={shadow} borderRadius="xl" overflow="hidden">
          <MenuItem onClick={() => handleCopy('princ')} icon={<FiCopy />}>
            <Text>Principal ID {shortPrincipalId} </Text>
          </MenuItem>
          <MenuItem onClick={() => handleCopy('acnt')} icon={<FiCopy />}>
            <Text>Account ID {shortaccountId} </Text>
          </MenuItem>
          <MenuItem onClick={() => navigate('/assets/transfer?tokenId=ryjl3-tyaaa-aaaaa-aaaba-cai') } icon={<FaExchangeAlt/>}>
            <Text>Transfer Token </Text>
          </MenuItem>
          <MenuItem onClick={handleDisconnect} icon={<BiExit />}>
            <Text>Disconnect</Text>
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

//   PlugMenu.displayName = 'PlugPrincipalIDTag';
