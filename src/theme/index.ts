import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import CloseButton from './components/close-button';
import Modal from './components/modal';
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
    Tabs,
    CloseButton,
    Modal,
  },
};

export const theme = extendTheme(appTheme);
