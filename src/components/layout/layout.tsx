import {  chakra, Container, Flex, HStack, IconButton, Link as ChakraLink, Menu, MenuButton,
  MenuDivider,MenuItem,MenuList,Tab,TabList,Tabs,Text,useColorMode,useColorModeValue,useToken,Alert,AlertIcon,CloseButton,
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
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ENV } from '@/config';
import { useHeaderResizeEffect } from '@/hooks';
import { modalsSliceActions, useAppDispatch, useWalletStore } from '@/store';
import { ExternalLink } from '@/utils';

import packageJSON from '@/../package.json';

import { LogoBox } from '../core';

import { FOOTER_HEIGHT, NAVIGATION_TABS } from './layout.constants';

import { WalletConnectBtn, WalletMenu } from '@/components/wallet';

import Widget from "@elna-ai/chat-widget";

import axios from 'axios';
import { BottomWarning } from './bottomWarning';

export const Layout: React.FC = ({ children, ...props }) => {

  const { isConnected } = useWalletStore();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const [headerHeight, setHeaderHeight] = useState('116px');

  const currentTabIndex = useMemo(
    () =>
      NAVIGATION_TABS.findIndex(({ url }) => location.pathname.includes(url)),
    [location]
  );

   const backgroundColor = useColorModeValue('custom.5', 'darkGreen');

  const backgroundColorValue = useToken('colors', backgroundColor);

  const { colorMode, toggleColorMode } = useColorMode();
  const [bannerMsg, setBannerMsg] = useState<string>('');;
  setBannerMsg;
  const menuBg = useColorModeValue('gray.50', 'custom.2');
  const menuShadow = useColorModeValue('base', 'none');

  useHeaderResizeEffect((element) => { setHeaderHeight(`${element.clientHeight}px`); });
  const [showBanner, setShowBanner] = useState(false);
  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  useEffect(() => {
    try {
      axios.get('https://cdn.sonic.ooo/data/appdata.json').then((resp: any) => {
        setBannerMsg(resp?.data?.topBannerText);
        if (resp?.data?.topBannerText) setShowBanner(true);
      });
    } catch (e) { }
  }, [])
  return (
    <>
      {(showBanner && bannerMsg) && (
        <Alert status="info" mb={4} bg={menuBg} borderRadius={'md'} justifyContent={'center'}>
          <Container maxW={['100%', 'container.xl', 'container.xl']}>
            <Flex><AlertIcon /><Text fontSize={14}>{bannerMsg} </Text></Flex>
          </Container>
          <CloseButton size="sm" onClick={handleCloseBanner} position="absolute" right="8px" top="8px" />
        </Alert>
      )}
      <Container as="header" maxW={['100%', 'container.xl', 'container.xl']} position="sticky" top={0} zIndex={10} id="header" bg={backgroundColorValue} >
        <Flex
          zIndex="1000" width="full" maxWidth="container.xl" margin="auto"
          direction="row" justifyContent="center" alignItems="center" flexWrap="wrap"
          gap="2" p={['4', '4', '8']} position="sticky" top="0"
        >
          <Flex display={['none', 'none', 'none', 'flex']} width={['0', '20%']} alignItems="center" justifyContent="center">
            <LogoBox />
          </Flex>
          <chakra.nav flex="1" display="flex" alignItems="center" justifyContent="center">
            <Tabs index={currentTabIndex} variant="solid-rounded" colorScheme="dark-blue">
              <TabList bg={menuBg} >
                {NAVIGATION_TABS.map(({ label, url }) => (
                  <Tab as={Link} key={label} to={url} px={6}>
                    {label}
                  </Tab>
                ))}

                <Tab display={['flex', 'flex', 'flex', 'flex']} as="a"
                  href={'https://lbp.sonic.ooo/'} target={'_blank'}
                  px={4}
                >
                  LBP
                  <FiArrowUpRight />
                </Tab>

                <Tab display={['none', 'none', 'flex', 'flex']} as="a"
                  href={ExternalLink.analyticsApp} target={ExternalLink.analyticsApp}
                  px={4}
                >
                  Analytics
                  <FiArrowUpRight />
                </Tab>
              </TabList>
            </Tabs>
          </chakra.nav>
          <Flex direction="row" width={['fit-content', 'fit-content', '20%']} gap="4" mr="-2"
            alignItems="center" justifyContent="flex-end">
            <HStack>
              {isConnected ? <WalletMenu placement="bottom-end" /> : <WalletConnectBtn />}
              <Menu placement="bottom-end">
                <MenuButton as={IconButton} aria-label="Menu" icon={<FaEllipsisH />} borderRadius="full" bg={menuBg} shadow={menuShadow} />
                <div>
                  <MenuList bg={menuBg} shadow={menuShadow} borderRadius="xl">
                    {ENV.isDarkModeEnabled && (
                      <MenuItem onClick={toggleColorMode} icon={colorMode === 'dark' ? <FaSun /> : <FaMoon />}>
                        {colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
                      </MenuItem>
                    )}
                    {isConnected && (
                      <MenuItem onClick={() => dispatch(modalsSliceActions.openMintManualModal())} icon={<FaRedo />}>
                        Retry minting
                      </MenuItem>
                    )}

                    <MenuDivider />
                    <ChakraLink href={ExternalLink.twitter} target={ExternalLink.twitter} rel="noopener noreferrer" fontWeight="bold">
                      <MenuItem icon={<FaTwitter />}>Twitter</MenuItem>
                    </ChakraLink>
                    <ChakraLink href={ExternalLink.discord} target={ExternalLink.discord} rel="noopener noreferrer" fontWeight="bold">
                      <MenuItem icon={<FaDiscord />}>Discord</MenuItem>
                    </ChakraLink>
                    <ChakraLink href={ExternalLink.medium} target={ExternalLink.medium} rel="noopener noreferrer" fontWeight="bold">
                      <MenuItem icon={<FaMedium />}>Medium</MenuItem>
                    </ChakraLink>
                    <ChakraLink href={ExternalLink.sonicDocs} target={ExternalLink.sonicDocs} rel="noopener noreferrer" fontWeight="bold">
                      <MenuItem icon={<FaBook />}>Documentation</MenuItem>
                    </ChakraLink>
                    <ChakraLink href={ExternalLink.swapApiDocs} target={ExternalLink.swapApiDocs} rel="noopener noreferrer" fontWeight="bold">
                      <MenuItem icon={<FaNetworkWired />}>API</MenuItem>
                    </ChakraLink>
                  </MenuList>
                </div>
              </Menu>
            </HStack>
          </Flex>
        </Flex>
      </Container>

      <Container as="main" maxW="xl" minH={`calc(100vh - ${headerHeight} - ${FOOTER_HEIGHT})`} py="4" display="flex" flexDirection="column" {...props}>
        {children}
      </Container>
      <BottomWarning/>
      
       <Widget wizardId="ebdc5e48-cb2b-418b-8a5e-c06dd23f3d30" title="Support Chat" description="Hi there! 🚀 I'm Sonic Helper"
        chatBg={"#1c1f43"} logo={'https://cdn.sonic.ooo/icons/qbizb-wiaaa-aaaaq-aabwq-cai'} />

      <chakra.footer px="4" py="2" position="fixed" bottom={0} left={0} right={0} pointerEvents="none">
        <Text>Sonic v{packageJSON.version}</Text>
      </chakra.footer>
      
    </>
  );
};
