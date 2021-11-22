import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import Tabs from './components/tabs';
import { colors } from './foundations';

const appTheme = {
  styles: {
    global: (props) => ({
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
  colors,
  components: {
    Tabs,
  },
};

export const theme = extendTheme(appTheme);
