import {
  chakra,
  Container,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  Tabs,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaBook } from '@react-icons/all-files/fa/FaBook';
import { FaDiscord } from '@react-icons/all-files/fa/FaDiscord';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';
import { FaMedium } from '@react-icons/all-files/fa/FaMedium';
import { FaMoon } from '@react-icons/all-files/fa/FaMoon';
import { FaNetworkWired } from '@react-icons/all-files/fa/FaNetworkWired';
import { FaRedo } from '@react-icons/all-files/fa/FaRedo';
import { FaSun } from '@react-icons/all-files/fa/FaSun';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ENV } from '@/config';
import { modalsSliceActions, useAppDispatch, usePlugStore } from '@/store';
import { theme } from '@/theme';

import packageJSON from '../../../package.json';
import { PlugButton } from '..';
import { LogoBox } from '../core';
import { PlugMenu } from '../plug/plug-menu';
import {
  FOOTER_HEIGHT,
  NAVBAR_HEIGHT,
  NAVIGATION_TABS,
} from './layout.constants';

export const Layout: React.FC = ({ children, ...props }) => {
  const { isConnected } = usePlugStore();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const currentTabIndex = useMemo(
    () =>
      NAVIGATION_TABS.findIndex(({ url }) => location.pathname.includes(url)),
    [location]
  );

  const backgroundColor = useColorModeValue('custom.5', 'black');

  const { colorMode, toggleColorMode } = useColorMode();

  const menuBg = useColorModeValue('gray.50', 'custom.2');
  const menuShadow = useColorModeValue('sm', 'none');

  return (
    <>
      <Container maxW="container.xl" position="sticky" top={0} zIndex={10}>
        <Grid
          position="relative"
          zIndex={-2}
          as="header"
          py="8"
          templateColumns="repeat(5, 1fr)"
          gap="4"
          alignItems="center"
          backgroundColor={backgroundColor}
          transition="background-color 200ms"
          _after={{
            content: "''",
            position: 'absolute',
            pointerEvents: 'none',
            height: 10,
            left: 0,
            right: 0,
            bottom: -10,
            background: `linear-gradient(to bottom, ${theme.colors.bg} 0%, transparent 100%)`,
          }}
        >
          <GridItem
            as={HStack}
            spacing={4}
            colSpan={1}
            justifySelf="center"
            alignItems="center"
          >
            <LogoBox />
          </GridItem>
          <GridItem colSpan={3} justifySelf="center">
            <chakra.nav>
              <Tabs
                index={currentTabIndex}
                variant="solid-rounded"
                colorScheme="dark-blue"
              >
                <TabList>
                  {NAVIGATION_TABS.map(({ label, url }) => (
                    <Tab
                      as={Link}
                      key={label}
                      isSelected={location.pathname === url}
                      to={url}
                    >
                      {label}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </chakra.nav>
          </GridItem>
          <GridItem colSpan={1} justifySelf="center">
            <HStack>
              {isConnected ? <PlugMenu /> : <PlugButton />}
              <Menu placement="bottom-end">
                <MenuButton
                  as={IconButton}
                  aria-label="Menu"
                  icon={<FaEllipsisH />}
                  borderRadius="full"
                  bg={menuBg}
                  shadow={menuShadow}
                />

                <MenuList bg={menuBg} shadow={menuShadow} borderRadius="xl">
                  {ENV.isDarkModeEnabled && (
                    <MenuItem
                      onClick={toggleColorMode}
                      icon={colorMode === 'dark' ? <FaMoon /> : <FaSun />}
                    >
                      {colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() =>
                      dispatch(modalsSliceActions.openRetryMintingModal())
                    }
                    icon={<FaRedo />}
                  >
                    Retry minting
                  </MenuItem>
                  <MenuDivider />
                  <ChakraLink
                    href={ENV.URLs.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaTwitter />}>Twitter</MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    href={ENV.URLs.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaDiscord />}>Discord</MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    href={ENV.URLs.medium}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaMedium />}>Medium</MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    href={ENV.URLs.sonicDocs}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaBook />}>Documentation</MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    href={ENV.URLs.sonicDocs}
                    target="_blank"
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaNetworkWired />}>API</MenuItem>
                  </ChakraLink>
                </MenuList>
              </Menu>
            </HStack>
          </GridItem>
        </Grid>
      </Container>

      <Container
        as="main"
        maxW="xl"
        minH={`calc(100vh - ${NAVBAR_HEIGHT} - ${FOOTER_HEIGHT})`}
        // maxH={`calc(100vh - ${NAVBAR_HEIGHT} - ${FOOTER_HEIGHT})`}
        py="10"
        display="flex"
        flexDirection="column"
        {...props}
      >
        {children}
      </Container>

      <chakra.footer
        px="4"
        py="2"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        background={`linear-gradient(to bottom, transparent 0%, ${theme.colors.bg} 100%)`}
      >
        <Text>Sonic v{packageJSON.version}</Text>
      </chakra.footer>
    </>
  );
};
