import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { theme } from '@/theme';

import { App } from './App';
import { store } from './store';

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme} resetCSS>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ChakraProvider>
  </>,
  document.getElementById('sonic-app-root')
);
