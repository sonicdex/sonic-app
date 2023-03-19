import {
  chakra,
  Container,
  Flex,
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
  useToken,
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
import { FiArrowUpRight } from '@react-icons/all-files/fi/FiArrowUpRight';
import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ENV } from '@/config';
import { useHeaderResizeEffect } from '@/hooks';
import { modalsSliceActions, useAppDispatch, usePlugStore } from '@/store';
import { ExternalLink } from '@/utils';

import packageJSON from '@/../package.json';
import { PlugButton } from '..';
import { LogoBox } from '../core';
import { PlugMenu } from '../plug/plug-menu';
import { FOOTER_HEIGHT, NAVIGATION_TABS } from './layout.constants';

export const Layout: React.FC = ({ children, ...props }) => {
  const { isConnected } = usePlugStore();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [headerHeight, setHeaderHeight] = useState('116px');

  const currentTabIndex = useMemo(
    () =>
      NAVIGATION_TABS.findIndex(({ url }) => location.pathname.includes(url)),
    [location]
  );

  const backgroundColor = useColorModeValue('custom.5', 'darkBlue');
  const backgroundColorValue = useToken('colors', backgroundColor);

  const { colorMode, toggleColorMode } = useColorMode();

  const menuBg = useColorModeValue('gray.50', 'custom.2');
  const menuShadow = useColorModeValue('base', 'none');

  useHeaderResizeEffect((element) => {
    setHeaderHeight(`${element.clientHeight}px`);
  });

  return (
    <>
      <Container
        maxW={['100%', 'container.xl', 'container.xl']}
        position="sticky"
        top={0}
        zIndex={10}
        id="header"
      >
        <Flex
          zIndex="1000"
          as="header"
          width="full"
          maxWidth="container.xl"
          margin="auto"
          direction="row"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          gap="4"
          p={['4', '4', '8']}
          position="sticky"
          top="0"
          bg={backgroundColor}
        >
          <Flex
            display={['none', 'none', 'none', 'flex']}
            width={['0', '24%']}
            alignItems="center"
            justifyContent="center"
          >
            <LogoBox />
          </Flex>
          <chakra.nav
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Tabs
              index={currentTabIndex}
              variant="solid-rounded"
              colorScheme="dark-blue"
            >
              <TabList bg={menuBg}>
                {NAVIGATION_TABS.map(({ label, url }) => (
                  <Tab
                    as={Link}
                    key={label}
                    // isSelected={location.pathname === url}
                    to={url}
                    px={6}
                  >
                    {label}
                  </Tab>
                ))}
                <Tab
                  display={['none', 'none', 'flex', 'flex']}
                  as="a"
                  href={ExternalLink.analyticsApp}
                  target={ExternalLink.analyticsApp}
                  px={4}
                >
                  Analytics
                  <FiArrowUpRight />
                </Tab>
              </TabList>
            </Tabs>
          </chakra.nav>
          <Flex
            direction="row"
            width={['fit-content', 'fit-content', '24%']}
            gap="4"
            mr="-2"
            alignItems="center"
            justifyContent="flex-end"
          >
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
                      icon={colorMode === 'dark' ? <FaSun /> : <FaMoon />}
                    >
                      {colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
                    </MenuItem>
                  )}
                  {isConnected && (
                    <MenuItem
                      onClick={() =>
                        dispatch(modalsSliceActions.openMintManualModal())
                      }
                      icon={<FaRedo />}
                    >
                      Retry minting
                    </MenuItem>
                  )}

                  <MenuDivider />
                  <ChakraLink
                    href={ExternalLink.twitter}
                    target={ExternalLink.twitter}
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaTwitter />}>Twitter</MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    href={ExternalLink.discord}
                    target={ExternalLink.discord}
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaDiscord />}>Discord</MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    href={ExternalLink.medium}
                    target={ExternalLink.medium}
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaMedium />}>Medium</MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    href={ExternalLink.sonicDocs}
                    target={ExternalLink.sonicDocs}
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaBook />}>Documentation</MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    href={ExternalLink.swapApiDocs}
                    target={ExternalLink.swapApiDocs}
                    rel="noopener noreferrer"
                    fontWeight="bold"
                  >
                    <MenuItem icon={<FaNetworkWired />}>API</MenuItem>
                  </ChakraLink>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Flex>
      </Container>

      <Container
        as="main"
        maxW="xl"
        minH={`calc(100vh - ${headerHeight} - ${FOOTER_HEIGHT})`}
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
        background={`linear-gradient(to bottom, transparent 0%, ${backgroundColorValue} 50%)`}
        pointerEvents="none"
      >
        <Text>Sonic v{packageJSON.version}</Text>
      </chakra.footer>
    </>
  );
};
