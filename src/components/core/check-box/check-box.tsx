import { Fade, Flex, Image } from '@chakra-ui/react';
import { MouseEvent } from 'react';

import { checkPlainSrc } from '@/assets';

type CheckboxProps = {
  checked: boolean;
  onClick: (event: MouseEvent<HTMLDivElement>) => any;
};

export const Checkbox = ({ checked, onClick }: CheckboxProps) => {
  return (
    <Flex
      cursor="pointer"
      borderRadius={1.5}
      width={6}
      height={6}
      onClick={onClick}
      border={checked ? 'none' : '1.5px solid'}
      borderColor="custom.1"
      bg={checked ? 'dark-blue.400' : ''}
      alignItems="center"
      justifyContent="center"
    >
      <Fade in={checked}>
        <Image src={checkPlainSrc} width={4} height={4} />
      </Fade>
    </Flex>
  );
};
