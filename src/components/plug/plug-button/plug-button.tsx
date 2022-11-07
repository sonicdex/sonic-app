import { Button, ButtonProps } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import type { Provider } from '@psychedelic/plug-inpage-provider';
import { forwardRef, useMemo } from 'react';

import { plugActions, PlugState, useAppDispatch, usePlugStore } from '@/store';

import { PlugLogo } from '../plug-logo/plug-logo';

export type PlugButtonProps = Omit<ButtonProps, 'color' | 'variant'> & {
  variant?: 'default' | 'dark';
};

export const PlugButton = forwardRef<HTMLButtonElement, PlugButtonProps>(
  ({ ...props }, ref) => {
    const { variant = 'default' } = props;
    const { state } = usePlugStore();
    const dispatch = useAppDispatch();

    const isPlugPAPIExists = Boolean(window.ic?.plug);

    const isLoading = useMemo(() => {
      return state === PlugState.Loading;
    }, [state]);

    const colorDark = useColorModeValue('gray.800', 'gray.500');
    const bgDark = useColorModeValue('gray.50', 'custom.2');
    const bgHoverDark = useColorModeValue('gray.50', 'gray.700');

    const colorLight = useColorModeValue('gray.800', 'white');
    const bgLight = useColorModeValue('gray.50', 'custom.2');
    const bgHoverLight = useColorModeValue('gray.50', 'gray.800');

    const shadow = useColorModeValue('base', 'none');

    const { color, bg, bgHover, leftIcon, before, borderRadius } =
      useMemo(() => {
        if (variant === 'dark') {
          return {
            color: colorDark,
            bg: bgDark,
            bgHover: bgHoverDark,
            borderRadius: 'xl',
          };
        }

        return {
          color: colorLight,
          bg: bgLight,
          bgHover: bgHoverLight,
          leftIcon: <PlugLogo />,
          before: {
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
          borderRadius: 'full',
        };
      }, [
        bgDark,
        bgHoverDark,
        bgHoverLight,
        bgLight,
        colorDark,
        colorLight,
        variant,
      ]);

    const handleClick = (): void => {
      switch (state) {
        case PlugState.Disconnected:
          dispatch(plugActions.connect());
          break;
        case PlugState.NotInstalled:
          window.open('https://plugwallet.ooo/', '_plug');
          break;
        case PlugState.Connected:
        case PlugState.Loading:
        default:
          break;
      }
    };

    return (
      <Button
        ref={ref}
        size="lg"
        leftIcon={leftIcon}
        onClick={handleClick}
        isDisabled={isLoading}
        borderRadius={borderRadius}
        backgroundColor={bg}
        shadow={shadow}
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
          ? 'Connect'
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
