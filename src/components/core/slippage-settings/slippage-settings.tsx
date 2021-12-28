import { Box, Button, Flex } from '@chakra-ui/react';
import { NumberInput } from '@/components';

type SlippageSettingsProps = {
  slippage: string;
  isAutoSlippage: boolean;
  setSlippage: (slippage: string) => any;
  setIsAutoSlippage: (isAutoSlippage: boolean) => any;
};

export const SlippageSettings = ({
  slippage,
  setSlippage,
  isAutoSlippage,
  setIsAutoSlippage,
}: SlippageSettingsProps) => {
  const inputBorderColor = isAutoSlippage ? '#373737' : '#3D52F4';
  const inputColor = isAutoSlippage ? '#888E8F' : '#F6FCFD';

  const handleInputClick = () => {
    if (isAutoSlippage) setIsAutoSlippage(false);
  };

  const handleButtonClick = () => {
    if (!isAutoSlippage) setIsAutoSlippage(true);
  };

  const handleChange = (value: string) => {
    let num = Number(value);
    if (num < 0) {
      setSlippage('0');
    } else if (num > 100) {
      setSlippage('100');
    } else {
      setSlippage(value.replace(/^0+/, '').replace(/^\./, '0.') || '0');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setSlippage(String(Number(e.target.value)));
  };

  return (
    <Box px={5} pt={3} pb={6}>
      <Box
        as="h1"
        pb={2}
        textAlign="left"
        fontSize="16px"
        mb={3}
        w="100%"
        borderBottom="1px solid #373737"
      >
        Transaction Settings
      </Box>
      <Box as="p" fontSize="14px" textAlign="left" fontWeight={400} mb={3}>
        Slippage tolerance
      </Box>
      <Flex direction="row" alignItems="center">
        <Button
          variant={isAutoSlippage ? 'gradient' : 'outline'}
          colorScheme="dark-blue"
          borderRadius="full"
          onClick={handleButtonClick}
          mr={3}
        >
          Auto
        </Button>
        <Box
          _after={{
            content: '"%"',
            fontWeight: 600,
            fontSize: '14px',
            ml: 1,
            mr: 4,
          }}
          onClick={handleInputClick}
          borderColor={inputBorderColor}
          borderStyle="solid"
          borderWidth="1px"
          borderRadius="full"
          display="inline-block"
        >
          <NumberInput
            value={slippage}
            setValue={handleChange}
            onBlur={handleBlur}
            ml={4}
            py={2.5}
            px={2.5}
            fontSize="sm"
            fontWeight={600}
            color={inputColor}
            borderRadius="full"
            margin-right="25px"
            w="unset"
          />
        </Box>
      </Flex>
    </Box>
  );
};
