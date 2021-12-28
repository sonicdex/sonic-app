import { useMemo } from 'react';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

export type ButtonProps = ChakraButtonProps & {
  gradient?: 'horizontal' | 'vertical';
  isWireframe?: boolean;
};

export const Button = ({
  gradient = 'vertical',
  isWireframe = false,
  ...props
}: ButtonProps) => {
  const background = useMemo(() => {
    if (isWireframe) {
      return 'none';
    }

    return gradient === 'horizontal'
      ? 'linear-gradient(108.08deg, #3D52F4 0%, #192985 100%)'
      : 'linear-gradient(180deg, #3D52F4 0%, #192985 100%)';
  }, [gradient, isWireframe]);

  return (
    <ChakraButton
      fontWeight="bold"
      borderRadius={12}
      textAlign="center"
      color="#F6FCFD"
      cursor="pointer"
      variant={isWireframe ? 'outline' : 'solid'}
      background={background}
      _disabled={{
        background: 'gray.800',
      }}
      _hover={{
        background,
        _disabled: {
          background: 'gray.800',
        },
      }}
      _active={{
        background,
      }}
      {...props}
    />
  );
};
