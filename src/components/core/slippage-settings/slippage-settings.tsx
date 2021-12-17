import { Box, Flex } from '@chakra-ui/react';
import { NumberInput, Button } from '@/components';

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
        Slippage tolerace
      </Box>
      <Flex direction="row" alignItems="center">
        <Button
          gradient="horizontal"
          borderRadius={100}
          onClick={handleButtonClick}
          isWireframe={!isAutoSlippage}
          mr={3}
        >
          Auto
        </Button>
        <Box
          _after={{
            content: '"%"',
            fontWeight: 600,
            fontSize: '14px',
            marginLeft: '-25px',
          }}
          onClick={handleInputClick}
        >
          <NumberInput
            value={slippage}
            setValue={setSlippage}
            py={2.5}
            px={2.5}
            fontSize="sm"
            fontWeight={600}
            color={inputColor}
            borderColor={inputBorderColor}
            borderStyle="solid"
            borderWidth="1px"
            borderRadius="full"
          />
        </Box>
      </Flex>
    </Box>
  );
};
