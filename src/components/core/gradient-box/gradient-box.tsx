import { useColorModeValue } from '@chakra-ui/color-mode';
import { Flex } from '@chakra-ui/layout';
import { FC, HTMLAttributes } from 'react';

type GradientBoxProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'md' | 'lg';
};

export const GradientBox: FC<GradientBoxProps> = ({
  size = 'md',
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
      position="relative"
      justifyContent="center"
      alignItems="center"
      backgroundClip="padding-box"
      borderWidth="2px"
      borderStyle="solid"
      borderColor="transparent"
      borderRadius="full"
      background={bg}
      {...boxProps[size]}
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
      size={size}
      {...props}
    />
  );
};
