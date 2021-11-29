import { Box, Flex, Fade } from '@chakra-ui/react';

type CheckboxProps = {
  checked: boolean;
  onChange: (boolean) => any;
};

export const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  return (
    <Flex
      cursor="pointer"
      borderRadius="6px"
      width="23px"
      height="23px"
      onClick={onChange}
      border={checked ? '' : '1.5px solid #888E8F'}
      bg={checked ? '#384CE3' : ''}
      alignItems="center"
      justifyContent="center"
    >
      <Fade in={checked}>
        <Box
          as="img"
          src={'/assets/check-plain.svg'}
          width="16px"
          height="16px"
        />
      </Fade>
    </Flex>
  );
};
