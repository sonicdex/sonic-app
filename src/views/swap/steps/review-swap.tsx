import { Box, Flex } from '@chakra-ui/react';

import { Checkbox, TitleBox, TokenBox, Button } from '@/components';

import { arrowDownSrc, infoSrc } from '@/assets';
import { MODALS } from '@/modals';
import { useModalStore } from '@/store';

type ReviewStepProps = {
  fromValue: string;
  toValue: string;
  fromToken: any;
  toToken: any;
  keepInSonic: boolean;
  nextStep: () => any;
  prevStep: () => any;
  setFromValue: (string) => any;
  tokenOptions: object;
  setKeepInSonic: (boolean) => any;
};

export const ReviewStep = ({
  fromValue,
  toValue,
  fromToken,
  toToken,
  nextStep,
  prevStep,
  keepInSonic,
  setFromValue,
  setKeepInSonic,
  tokenOptions,
}: ReviewStepProps) => {
  const {
    setCurrentModal,
    setCurrentModalData,
    clearModal,
    setCurrentModalState,
  } = useModalStore();

  const handleApproveSwap = () => {
    // Integration: Do swap
    // trigger modals.
    setCurrentModalData({ fromToken: fromToken.name, toToken: toToken.name });
    setCurrentModalState('deposit');
    setCurrentModal(MODALS.swapProgress);

    setTimeout(() => setCurrentModalState('swap'), 3000);
    setTimeout(() => setCurrentModalState('withdraw'), 6000);
    setTimeout(() => {
      setFromValue('0.00');
      clearModal();
      nextStep();
    }, 9000);
  };

  return (
    <>
      <TitleBox title="Swap" settings="sd" onArrowBack={prevStep} />
      <Flex direction="column" alignItems="center" mb="20px">
        <Box mt="20px" width="100%">
          <TokenBox
            value={fromValue}
            setValue={() => {}}
            onTokenSelect={() => {}}
            tokenOptions={Object.values(tokenOptions)}
            currentToken={fromToken}
            balance="0.00"
            amount="0.00"
            disabled
            menuDisabled
          />
        </Box>
        <Box
          borderRadius="15px"
          width="42px"
          height="42px"
          py="12px"
          px="13px"
          bg="#3D52F4"
          mt="-16px"
          mb="-26px"
          zIndex={1200}
        >
          <Box as="img" m="auto" src={arrowDownSrc} />
        </Box>
        <Box mt="10px" width="100%">
          <TokenBox
            value={toValue}
            setValue={() => {}}
            onTokenSelect={() => {}}
            tokenOptions={Object.values(tokenOptions)}
            currentToken={toToken}
            status="active"
            balance="0.00"
            amount="0.00"
            glow
            disabled
            menuDisabled
          />
        </Box>
      </Flex>
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="20px"
        mb="20px"
        bg="#1E1E1E"
        px="20px"
        py="16px"
      >
        <Flex direction="row" alignItems="center">
          <Checkbox
            checked={keepInSonic}
            onChange={() => setKeepInSonic(!keepInSonic)}
          />
          <Box
            as="p"
            fontSize="16px"
            fontWeight={600}
            ml="9px"
            transition="color 200ms"
            color={keepInSonic ? '#FFFFFF' : '#888E8F'}
          >
            Keep tokens in Sonic after swap
          </Box>
        </Flex>
        <Box
          as="img"
          src={infoSrc}
          width="20px"
          transition="opacity 200ms"
          opacity={keepInSonic ? 1 : 0.5}
        />
      </Flex>
      <Button
        onClick={handleApproveSwap}
        title="Confirm Swap"
        fontWeight={700}
        fontSize={22}
        borderRadius={20}
      />
    </>
  );
};
