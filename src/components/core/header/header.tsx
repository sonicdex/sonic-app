import { Box, Flex } from '@chakra-ui/react';
import { Button } from '@/components';

type HeaderProps = {
  title: string;
  buttonText?: string;
  onButtonClick?: () => any;
};

export const Header = ({ title, buttonText, onButtonClick }: HeaderProps) => {
  const paddingToLine = buttonText && onButtonClick ? '17px' : '24px';
  const marginTop = buttonText && onButtonClick ? '-8px' : '0px';

  return (
    <Flex
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      pb={paddingToLine}
      mt={marginTop}
      borderBottom="1px solid #373737"
      mb={5}
    >
      <Box as="h3" fontWeight={700} color="#F6FCFD">
        {title}
      </Box>
      {buttonText && onButtonClick && (
        <Button onClick={() => onButtonClick()}>{buttonText}</Button>
      )}
    </Flex>
  );
};
