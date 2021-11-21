import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';

import { theme } from '@/theme';

import { store } from './store';
import { App } from './App';

ReactDOM.render(
  <ChakraProvider theme={theme} resetCSS>
    <ColorModeProvider options={theme.config}>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ColorModeProvider>
  </ChakraProvider>,
  document.getElementById('sonic-app-root')
);
