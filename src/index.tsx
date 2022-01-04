import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { theme } from '@/theme';

import { App } from './App';
import { store } from './store';

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
