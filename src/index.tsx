import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { theme } from '@/theme';

import { App } from './App';
import { Maintenance } from './components';
import { ENV } from './config';
import { store } from './store';

let Render: React.FC;

if (ENV.maintenanceMode) {
  Render = () => <Maintenance />;
} else {
  Render = () => <App />;
}

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme} resetCSS>
      <ReduxProvider store={store}>
        <Render />
      </ReduxProvider>
    </ChakraProvider>
  </>,
  document.getElementById('sonic-app-root')
);
