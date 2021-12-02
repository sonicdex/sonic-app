import { Image, Flex, Fade } from '@chakra-ui/react';
import { checkPlainSrc } from '@/assets';
import { MouseEvent } from 'react';

type CheckboxProps = {
  checked: boolean;
  onClick: (event: MouseEvent<HTMLDivElement>) => any;
};

export const Checkbox = ({ checked, onClick }: CheckboxProps) => {
  return (
    <Flex
      cursor="pointer"
      borderRadius="6px"
      width="23px"
      height="23px"
      onClick={onClick}
      border={checked ? '' : '1.5px solid #888E8F'}
      bg={checked ? '#384CE3' : ''}
      alignItems="center"
      justifyContent="center"
    >
      <Fade in={checked}>
        <Image src={checkPlainSrc} width="16px" height="16px" />
      </Fade>
    </Flex>
  );
};
