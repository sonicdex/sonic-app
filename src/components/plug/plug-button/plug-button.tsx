import { Button, ButtonProps } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import type { Provider } from '@psychedelic/plug-inpage-provider';
import { forwardRef, useMemo } from 'react';

import { ENV } from '@/config';
import { requestConnect } from '@/integrations/plug';
import {
  FeatureState,
  plugActions,
  useAppDispatch,
  usePlugStore,
} from '@/store';

import { PlugLogo } from '../plug-logo/plug-logo';
import { PLUG_WALLET_WEBSITE_URL } from './constants';

export type PlugButtonProps = Omit<ButtonProps, 'color' | 'variant'> & {
  whitelist?: string[];
  host?: string;
  variant?: 'default' | 'dark';
};

export const PlugButton = forwardRef<HTMLButtonElement, PlugButtonProps>(
  (
    { whitelist = Object.values(ENV.canisterIds), host = ENV.host, ...props },
    ref
  ) => {
    const { variant = 'default' } = props;
    const { state } = usePlugStore();
    const dispatch = useAppDispatch();

    const handleConnect = (isConnected: boolean) => {
      dispatch(plugActions.setIsConnected(isConnected));
    };

    const isPlugPAPIExists = Boolean(window.ic?.plug);

    const handleConnectAttempt = async () => {
      if (!isPlugPAPIExists) {
        window.open(PLUG_WALLET_WEBSITE_URL, '_blank');
        return;
      }

      try {
        dispatch(plugActions.setState(FeatureState.Loading));

        const isConnected = await requestConnect({
          whitelist,
          host,
        });

        if (isConnected) {
          handleConnect(isConnected);
        }
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(plugActions.setState(FeatureState.Idle));
      }
    };

    const isLoading = useMemo(() => {
      return state === FeatureState.Loading;
    }, [state]);

    const [color, bg, bgHover, leftIcon, before, borderRadius] = useMemo(() => {
      if (variant === 'dark') {
        return [
          useColorModeValue('gray.500', 'gray.500'),
          useColorModeValue('gray.100', 'gray.800'),
          useColorModeValue('gray.200', 'gray.700'),
          undefined,
          {},
          'xl',
        ];
      }
      return [
        useColorModeValue('gray.500', 'white'),
        useColorModeValue('gray.100', 'gray.900'),
        useColorModeValue('gray.200', 'gray.800'),
        <PlugLogo />,
        {
          content: "''",
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 'hide',
          margin: '-2px',
          borderRadius: 'inherit',
          background:
            'linear-gradient(93.07deg,#ffd719 0.61%,#f754d4 33.98%,#1fd1ec 65.84%,#48fa6b 97.7%)',
        },
        'full',
      ];
    }, [variant]);

    return (
      <Button
        ref={ref}
        size="lg"
        leftIcon={leftIcon}
        onClick={isLoading ? () => null : handleConnectAttempt}
        isDisabled={isLoading}
        borderRadius={borderRadius}
        backgroundColor={bg}
        _hover={{
          backgroundColor: bgHover,
          _disabled: { backgroundColor: bg },
        }}
        _active={{ backgroundColor: bgHover }}
        _disabled={{ backgroundColor: bg, cursor: 'not-allowed' }}
        _before={before}
        color={color}
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
