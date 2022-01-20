import { Box, Button, Flex, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { FaExclamationTriangle } from '@react-icons/all-files/fa/FaExclamationTriangle';
import { useMemo } from 'react';

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
  const inputBorderColor = isAutoSlippage ? 'custom.3' : 'dark-blue.500';
  const inputColor = isAutoSlippage ? 'custom.1' : 'gray.50';

  const handleInputClick = () => {
    if (isAutoSlippage) setIsAutoSlippage(false);
  };

  const handleButtonClick = () => {
    if (!isAutoSlippage) setIsAutoSlippage(true);
  };

  const handleChange = (value: string) => {
    const num = Number(value);
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

  const warningMessage = useMemo(() => {
    if (Number(slippage) < 0.25) {
      return 'Your tolerance is set very low, the transaction may fail.';
    }

    if (Number(slippage) > 5) {
      return 'Your slippage tolerance is set very high, the received amount of tokens may reduced because of it. Consider reducing it.';
    }
  }, [slippage]);

  return (
    <Stack zIndex="popover" px={5} pt={3} pb={3}>
      <Box
        as="h1"
        pb={2}
        textAlign="left"
        fontSize="16px"
        w="100%"
        borderBottom="1px solid #373737"
      >
        Transaction Settings
      </Box>
      <Box as="p" fontSize="14px" textAlign="left" fontWeight={400}>
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
      {warningMessage && (
        <HStack textAlign="left" color="yellow.500" maxW="320px" spacing={4}>
          <Icon as={FaExclamationTriangle} height={6} width={6} />
          <Text fontWeight="normal" fontSize="sm">
            {warningMessage}
          </Text>
        </HStack>
      )}
    </Stack>
  );
};
