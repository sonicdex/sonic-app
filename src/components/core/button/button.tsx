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

  const border = useMemo(() => {
    if (isWireframe) {
      return '1px solid #FFFFFF';
    }

    return 'none';
  }, [isWireframe]);

  return (
    <ChakraButton
      fontWeight="bold"
      borderRadius={12}
      textAlign="center"
      border={border}
      color="#F6FCFD"
      cursor="pointer"
      background={background}
      _hover={{
        background,
      }}
      {...props}
    />
  );
};
