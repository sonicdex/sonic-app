import { Box } from "@chakra-ui/react"

type ButtonProps = {
  title: string,
  onClick: () => void,
  disabled?: boolean,
  size?: 'full' | 'fit',
  borderRadius?: number,
  fontWeight?: number,
  fontSize?: number,
  gradient?: 'horizontal' | 'vertical',
};

export const Button = ({
  onClick,
  title,
  borderRadius = 12,
  fontWeight = 600,
  fontSize = 16,
  size = 'full',
  gradient = 'vertical',
  disabled = false
}: ButtonProps) => {
  const background = gradient === 'horizontal' ?
    'linear-gradient(108.08deg, #3D52F4 0%, #192985 100%)' :
    'linear-gradient(180deg, #3D52F4 0%, #192985 100%)';
  const handleOnClick = () => {
    if (disabled) return;

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
      color={ disabled ? '#888E8F' : '#F6FCFD' }
      width={ size === 'full' ? '100%' : 'fit-content' }
      cursor={ disabled ? 'not-allowed' : 'pointer' } 
      background={ disabled ? '#282828' : background }
    >
      {title}
    </Box>
  );
};
