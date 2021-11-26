import { Box } from "@chakra-ui/react"

type ButtonProps = {
  title: string,
  onClick: () => void,
  size?: 'full' | 'fit',
  borderRadius?: number,
  fontWeight?: number,
  fontSize?: number,
  gradient?: 'horizontal' | 'vertical',
  status?: 'disabled' | 'grey-disabled',
};

export const Button = ({
  onClick,
  title,
  status,
  borderRadius = 12,
  fontWeight = 600,
  fontSize = 16,
  size = 'full',
  gradient = 'vertical',
}: ButtonProps) => {
  const background = gradient === 'horizontal' ?
    'linear-gradient(108.08deg, #3D52F4 0%, #192985 100%)' :
    'linear-gradient(180deg, #3D52F4 0%, #192985 100%)';
  const handleOnClick = () => {
    if (status) return;

    onClick();
  }

  return (
    <Box
      py="9px"
      px="15px"
      fontSize={`${fontSize}px`}
      fontWeight={fontWeight}
      onClick={handleOnClick}
      borderRadius={borderRadius}
      textAlign="center"
      color={ status === 'grey-disabled' ? '#888E8F' : '#F6FCFD' }
      width={ size === 'full' ? '100%' : 'fit-content' }
      cursor={ status ? 'not-allowed' : 'pointer' } 
      background={ status === 'grey-disabled' ? '#282828' : background }
      transition="opacity 400ms"
      opacity={ status === 'disabled' ? 0.4 : 1 }
    >
      {title}
    </Box>
  );
};
