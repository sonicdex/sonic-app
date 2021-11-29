import { useColorModeValue } from '@chakra-ui/color-mode';
import { Flex, Box } from '@chakra-ui/react';
import { FC, HTMLAttributes } from 'react';

type GradientBoxProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'md' | 'lg';
};

/*
   _before={{
content: '""',
position: 'absolute',
top: 0,
right: 0,
bottom: 0,
left: 0,
margin: '-4px',
borderRadius: 'inherit',
zIndex: 'hide',
background:
'linear-gradient(93.07deg,#ffd719 0.61%,#f754d4 33.98%,#1fd1ec 65.84%,#48fa6b 97.7%)',
}}
 */

export const GradientBox: FC<GradientBoxProps> = ({
  size = 'md',
  children,
  ...props
}: GradientBoxProps) => {
  const bg = useColorModeValue('gray.100', 'gray.800');

  const boxProps = {
    sm: {
      w: '4',
      h: '4',
    },
    md: {
      w: '6',
      h: '6',
    },
    lg: {
      w: '8',
      h: '8',
    },
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      borderRadius="full"
      background={bg}
      pt="-4px"
      {...boxProps[size]}
      size={size}
    >
      <Box
        position="absolute"
        bg="linear-gradient(93.07deg,#ffd719 0.61%,#f754d4 33.98%,#1fd1ec 65.84%,#48fa6b 97.7%)"
        width="27px"
        height="27px"
        borderRadius="full"
      />
      <Box
        position="absolute"
        bg="#1E1E1E"
        height="25px"
        width="25px"
        borderRadius="full"
      />
      {children}
    </Flex>
  );
};
