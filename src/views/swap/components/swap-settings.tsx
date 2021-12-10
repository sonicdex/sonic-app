import { Box, Flex } from '@chakra-ui/react';
import { NumberInput, Button } from '@/components';

type SwapSettingsProps = {
  slippage: string;
  isAuto: boolean;
  setSlippage: (arg0: string) => any;
  setIsAuto: (arg0: boolean) => any;
};

export const SwapSettings = ({
  slippage,
  setSlippage,
  isAuto,
  setIsAuto,
}: SwapSettingsProps) => {
  const inputBorderColor = isAuto ? '#373737' : '#3D52F4';
  const inputColor = isAuto ? '#888E8F' : '#F6FCFD';
  const buttonOpacity = isAuto ? 1 : 0.3;

  const handleInputClick = () => {
    if (isAuto) setIsAuto(false);
  };

  const handleButtonClick = () => {
    if (!isAuto) setIsAuto(true);
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
          opacity={buttonOpacity}
          onClick={handleButtonClick}
          isWireframe={!isAuto}
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
            style={{
              paddingTop: '10px',
              paddingBottom: '10px',
              width: '195px',
              fontSize: '14px',
              fontWeight: 600,
              color: inputColor,
              border: `1px solid ${inputBorderColor}`,
              borderRadius: '100px',
              paddingRight: '30px',
            }}
          />
        </Box>
      </Flex>
    </Box>
  );
};
