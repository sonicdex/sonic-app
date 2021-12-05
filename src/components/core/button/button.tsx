import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

type ButtonProps = ChakraButtonProps & {
  title: string;
  onClick: () => void;
  gradient?: 'horizontal' | 'vertical';
  status?: 'disabled' | 'grey-disabled';
};

export const Button = ({
  onClick,
  title,
  status,
  gradient = 'vertical',
  ...props
}: ButtonProps) => {
  const background =
    gradient === 'horizontal'
      ? 'linear-gradient(108.08deg, #3D52F4 0%, #192985 100%)'
      : 'linear-gradient(180deg, #3D52F4 0%, #192985 100%)';

  const handleOnClick = () => {
    if (status) return;

    onClick();
  };

  return (
    <ChakraButton
      py={2}
      px={4}
      fontSize="md"
      fontWeight="bold"
      onClick={handleOnClick}
      borderRadius={12}
      textAlign="center"
      color={status === 'grey-disabled' ? '#888E8F' : '#F6FCFD'}
      cursor={status ? 'not-allowed' : 'pointer'}
      background={status === 'grey-disabled' ? '#282828' : background}
      transition="opacity 400ms"
      opacity={status === 'disabled' ? 0.4 : 1}
      isFullWidth
      {...props}
    >
      {title}
    </ChakraButton>
  );
};
