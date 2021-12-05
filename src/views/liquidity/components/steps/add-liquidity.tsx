import { useState } from 'react';
import { Text, Flex, Image, Box } from '@chakra-ui/react';

import { Button, TitleBox, TokenBox } from '@/components';

import { plusSrc, equalSrc } from '@/assets';

type AddLiquidityStepProps = {
  onPrevious: () => any;
  onAdd: (any: any) => any;
};

const BUTTON_TITLES = ['Review Supply', 'Confirm Supply'];

export const AddLiquidityStep = ({
  onPrevious,
  onAdd,
}: AddLiquidityStepProps) => {
  // subStep 0 for review 1 for add liquidity
  const [subStep, setSubStep] = useState(0);

  const [fromValue, setFromValue] = useState('0.00');
  const [fromToken, setFromToken] = useState();

  const [toValue, setToValue] = useState('0.00');
  const [toToken, setToToken] = useState();

  const handleTokenSelect = (tokenName: string, setter: any) => {
    // TODO: add handler function
    console.log(tokenName, setter);
  };

  const handlePreviousStep = () => {
    if (subStep === 0) {
      onPrevious();
    } else {
      setSubStep(subStep - 1);
    }
  };

  const getActiveStatus = (token?: string, value?: string) => {
    const shouldBeActive = token && value?.length && parseFloat(value) > 0;

    return shouldBeActive && subStep !== 1 ? 'active' : undefined;
  };

  const shouldButtonBeActive = () => {
    if (subStep === 1) return true;

    const fromTokenCondition =
      getActiveStatus(fromToken, fromValue) === 'active';
    const toTokenCondition = getActiveStatus(toToken, toValue) === 'active';

    return fromTokenCondition && toTokenCondition;
  };

  const buttonTitle = BUTTON_TITLES[subStep];

  const handleButtonClick = () => {
    switch (subStep) {
      case 0:
        setSubStep(1);
        break;
      case 1:
        // Add liquidity integration
        onAdd(null);
        break;
    }
  };

  return (
    <>
      <TitleBox
        onArrowBack={handlePreviousStep}
        title="Add Liquidity"
        settings={true}
      />
      <Flex mt={5} direction="column" alignItems="center">
        <Box width="100%">
          <TokenBox
            value={fromValue}
            setValue={setFromValue}
            onTokenSelect={(tokenName) =>
              handleTokenSelect(tokenName, setFromToken)
            }
            tokenOptions={[]}
            currentToken={fromToken}
            status={getActiveStatus(fromToken, fromValue)}
            disabled={subStep === 1}
            menuDisabled={subStep === 1}
            balance="0.00"
            amount="0.00"
          />
        </Box>
        <Box
          borderRadius={4}
          width={10}
          height={10}
          border="1px solid #373737"
          py={3}
          px={3}
          bg="#1E1E1E"
          mt="-16px"
          mb="-26px"
          zIndex={1200}
        >
          <Image m="auto" src={plusSrc} />
        </Box>
        <Box mt={2.5} width="100%">
          <TokenBox
            value={toValue}
            setValue={setToValue}
            onTokenSelect={(tokenName) =>
              handleTokenSelect(tokenName, setToToken)
            }
            tokenOptions={[]}
            currentToken={toToken}
            status={getActiveStatus(toToken, toValue)}
            disabled={subStep === 1}
            menuDisabled={subStep === 1}
            balance="0.00"
            amount="0.00"
          />
        </Box>
        {subStep === 1 && (
          <>
            <Flex
              direction="column"
              alignItems="center"
              borderRadius={4}
              width={10}
              height={10}
              py={3}
              px={3}
              bg="#3D52F4"
              mt="-16px"
              mb="-26px"
              zIndex={1200}
            >
              <Image m="auto" src={equalSrc} />
            </Flex>
            <Box mt={2.5} width="100%">
              <TokenBox
                value={toValue}
                setValue={setToValue}
                onTokenSelect={(tokenName) =>
                  handleTokenSelect(tokenName, setToToken)
                }
                tokenOptions={[]}
                currentToken={toToken}
                status="active"
                balance="0.00"
                balanceText="Share of pool:"
                amountText="SHARE HERE"
                amount="0.00"
                disabled
                menuDisabled
                glow
              />
            </Box>
          </>
        )}
        <Flex
          direction="row"
          justifyContent="space-between"
          width="100%"
          my={2.5}
          px={5}
        >
          <Text color="#888E8F">{`${'fromToken'} + ${'toToken'}`}</Text>
          <Text color="#888E8F">{`1 ${'fromToken'} = 0.23 ${'toToken'}`}</Text>
        </Flex>
      </Flex>
      <Button
        fontSize="2xl"
        fontWeight={700}
        borderRadius={20}
        onClick={handleButtonClick}
        status={shouldButtonBeActive() ? undefined : 'disabled'}
      >
        {buttonTitle}
      </Button>
    </>
  );
};
