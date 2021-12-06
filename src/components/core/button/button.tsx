import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

export type ButtonProps = ChakraButtonProps & {
  gradient?: 'horizontal' | 'vertical';
};

export const Button = ({ gradient = 'vertical', ...props }: ButtonProps) => {
  const background =
    gradient === 'horizontal'
      ? 'linear-gradient(108.08deg, #3D52F4 0%, #192985 100%)'
      : 'linear-gradient(180deg, #3D52F4 0%, #192985 100%)';

  return (
    <ChakraButton
      fontWeight="bold"
      borderRadius={12}
      textAlign="center"
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
