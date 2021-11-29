import { forwardRef } from 'react';
import type { Provider } from '@psychedelic/plug-inpage-provider';

import { FeatureState, usePlugStore } from '@/store';

import { PlugLogo } from '../plug-logo/plug-logo';
import { PLUG_WALLET_WEBSITE_URL } from './constants';
import { Button, ButtonProps } from '@chakra-ui/button';
import { ENV } from '@/config';
import { requestConnect } from '@/integrations/plug';
import { useColorModeValue } from '@chakra-ui/color-mode';

export type PlugButtonProps = Omit<ButtonProps, 'color' | 'variant'> & {
  whitelist?: string[];
  host?: string;
};

export const PlugButton = forwardRef<HTMLButtonElement, PlugButtonProps>(
  (
    { whitelist = Object.values(ENV.canisterIds), host = ENV.host, ...props },
    ref
  ) => {
    const { setIsConnected, setPlugState, state } = usePlugStore();

    const handleConnect = (isConnected: boolean) => {
      setIsConnected(isConnected);
    };

    const isPlugPAPIExists = Boolean(window.ic?.plug);

    const handleConnectAttempt = async () => {
      if (!isPlugPAPIExists) {
        window.open(PLUG_WALLET_WEBSITE_URL, '_blank');
        return false;
      }

      try {
        setPlugState(FeatureState.Loading);
        const isConnected = await requestConnect({
          whitelist,
          host,
        });

        if (isConnected) {
          if (handleConnect) {
            handleConnect(isConnected);
          }
          return true;
        }

        return false;
      } catch (err) {
        console.error(err);

        return false;
      } finally {
        setPlugState(FeatureState.Idle);
      }
    };

    const isLoading = state === FeatureState.Loading;

    const bg = useColorModeValue('gray.100', 'gray.900');
    const bgHover = useColorModeValue('gray.200', 'gray.800');

    return (
      <Button
        ref={ref}
        size="lg"
        leftIcon={<PlugLogo />}
        onClick={isLoading ? () => null : handleConnectAttempt}
        isDisabled={isLoading}
        borderRadius="full"
        backgroundColor={bg}
        _hover={{
          backgroundColor: bgHover,
          _disabled: { backgroundColor: bg },
        }}
        _active={{ backgroundColor: bgHover }}
        _disabled={{ backgroundColor: bg, cursor: 'not-allowed' }}
        _before={{
          content: "''",
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 'hide',
          margin: '-3px',
          borderRadius: 'inherit',
          background:
            'linear-gradient(93.07deg,#ffd719 0.61%,#f754d4 33.98%,#1fd1ec 65.84%,#48fa6b 97.7%)',
        }}
        {...props}
      >
        {isLoading
          ? 'Loading...'
          : isPlugPAPIExists
          ? 'Connect to Plug'
          : 'Install Plug'}
      </Button>
    );
  }
);

PlugButton.displayName = 'PlugButton';

declare global {
  interface Window {
    ic?: {
      plug?: Provider;
    };
  }
}
