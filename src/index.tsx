import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { theme } from '@/theme';

import { App } from './App';
import { Maintenance } from './components';
import { ENV } from './config';
import { store } from './store';

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://aab2a72afcbc4c13b07142e955c4e80d@o4505044540325888.ingest.sentry.io/4505044542029824",
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

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
