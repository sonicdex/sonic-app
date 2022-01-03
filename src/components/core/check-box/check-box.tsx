import { Fade,Flex, Image } from '@chakra-ui/react';
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
      border={checked ? '' : '1.5px solid #888E8F'}
      bg={checked ? '#384CE3' : ''}
      alignItems="center"
      justifyContent="center"
    >
      <Fade in={checked}>
        <Image src={checkPlainSrc} width={4} height={4} />
      </Fade>
    </Flex>
  );
};
