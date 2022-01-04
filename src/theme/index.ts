import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import Button from './components/button';
import CloseButton from './components/close-button';
import Modal from './components/modal';
import Popover from './components/popover';
import Tabs from './components/tabs';
import { colors } from './foundations';

const appTheme = {
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('white', 'bg')(props),
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
  },
};

export const theme = extendTheme(appTheme);
