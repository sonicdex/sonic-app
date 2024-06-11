import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import Button from './components/button';
import CloseButton from './components/close-button';
import Menu from './components/menu';
import Modal from './components/modal';
import Popover from './components/popover';
import Tabs from './components/tabs';
import { colors } from './foundations';
import { Input } from "./components/input"
const appTheme = {
  styles: {
    global: (props: any) => ({
      html: {
        fontSize: ['12px', '14px', '16px'],
      },
      body: {
        // bg: mode('custom.5', 'black')(props),
        bg: mode('app.background.body.light', 'app.background.body.dark')(props),
      },
    }),
  },
  fonts: {
    heading: 'Nunito Sans',
    body: 'Nunito Sans',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    
  },
  sizes: {
    modalHeight: '345px',
  },
  colors,
  components: {
    Button,
    Tabs,
    CloseButton,
    Modal,
    Popover,
    Menu,
    Input
  },
};

export const theme = extendTheme(appTheme);
