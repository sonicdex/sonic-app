import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { Liquidity } from '@sonicdex/sonic-js';
import { FaArrowDown } from '@react-icons/all-files/fa/FaArrowDown';
import { useMemo } from 'react';

import { ENV } from '@/config';
import {
  FeatureState,
  liquidityViewActions,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useLiquidityViewStore,
  useModalsStore,
  useNotificationStore,
  useSwapCanisterStore,
} from '@/store';
import { debounce } from '@/utils/function';

import { RemoveLiquidityModalAsset } from './remove-liquidity-modal-asset';

const PERCENTAGE_PRESETS = [25, 50, 75, 100];

export const RemoveLiquidityModal = () => {
  const dispatch = useAppDispatch();
  const { isRemoveLiquidityModalOpened } = useModalsStore();
  const { addNotification } = useNotificationStore();
  const { token0, token1, removeAmountPercentage, keepInSonic } = useLiquidityViewStore();
  const { allPairs, userLPBalances, userLPBalancesState } = useSwapCanisterStore();

  const handleModalClose = () => {
    dispatch(modalsSliceActions.closeRemoveLiquidityModal());
  };

  const handleRemoveLiquidity = () => {
    addNotification({
      title: `Removing LP of ${token0.metadata?.symbol} + ${token1.metadata?.symbol}`,
      type: NotificationType.RemoveLiquidity,
      id: String(new Date().getTime()),
    });
    debounce(() => {
      dispatch(liquidityViewActions.setRemoveAmountPercentage(0));
    }, 300);
    handleModalClose();
  };

  const handleSliderChange = (value: number) => {
    dispatch(liquidityViewActions.setRemoveAmountPercentage(value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === '')
      return dispatch(liquidityViewActions.setRemoveAmountPercentage(NaN));
    const newValue = Math.max(1, Math.min(100, Number(value)));
    dispatch(liquidityViewActions.setRemoveAmountPercentage(newValue));
  };


  const isBalancesUpdating = useMemo(
    () => userLPBalancesState === FeatureState.Updating,
    [userLPBalancesState]
  );

  const { balance0, balance1 } = useMemo(() => {
    if (userLPBalances && allPairs && token0.metadata && token1.metadata) {
      const lpBalance = userLPBalances[token0.metadata.id]?.[token1.metadata.id];
      const pair = allPairs[token0.metadata.id]?.[token1.metadata.id];

      const { balance0, balance1 } = Liquidity.getTokenBalances({
        decimals0: token0.metadata.decimals,
        decimals1: token1.metadata.decimals,
        reserve0: pair?.reserve0 ?? 0,
        reserve1: pair?.reserve1 ?? 0,
        totalSupply: pair?.totalSupply ?? 0,
        lpBalance,
      });

      return {
        balance0: balance0.multipliedBy(removeAmountPercentage / 100).toString(),
        balance1: balance1.multipliedBy(removeAmountPercentage / 100).toString(),
      };
    }

    return { balance0: '0', balance1: '0' };
  }, [userLPBalances, allPairs, token0.metadata, token1.metadata, removeAmountPercentage]);

  const { buttonMessage, isAmountIsLow } = useMemo(() => {
    const AMOUNT_TOO_LOW_LABEL = 'Amount is too low';

    if (userLPBalances && token0.metadata && token1.metadata) {
      const tokensLPBalance =
        userLPBalances[token0.metadata.id]?.[token1.metadata.id];
      const lpAmount = (removeAmountPercentage / 100) * tokensLPBalance;

      const isAmountIsLow =
        lpAmount <= ENV.swapCanisterFee || !removeAmountPercentage;

      return {
        buttonMessage: isAmountIsLow ? AMOUNT_TOO_LOW_LABEL : 'Remove',
        isAmountIsLow,
      };
    }

    return {
      buttonMessage: AMOUNT_TOO_LOW_LABEL,
      isAmountIsLow: true,
    };
  }, [
    removeAmountPercentage,
    token0.metadata,
    token1.metadata,
    userLPBalances,
  ]);

  const borderColor = useColorModeValue('gray.300', 'gray.700');

  const checkboxColorKeepInSonic = useColorModeValue('black', 'white');
  const checkboxColorNotKeepInSonic = useColorModeValue('gray.600', 'custom.1');
  const checkboxColor = keepInSonic ? checkboxColorKeepInSonic : checkboxColorNotKeepInSonic;

  const onInputValueChange = (symbol: string, newvalue: number) => {
    var percentage = 0;
    if (userLPBalances && allPairs && token0.metadata && token1.metadata) {
      const lpBalance = userLPBalances[token0.metadata.id]?.[token1.metadata.id];
      const pair = allPairs[token0.metadata.id]?.[token1.metadata.id];
      var lpToken = Liquidity.getTokenBalances({ decimals0: token0.metadata.decimals, decimals1: token1.metadata.decimals, reserve0: pair?.reserve0 ?? 0, reserve1: pair?.reserve1 ?? 0, totalSupply: pair?.totalSupply ?? 0, lpBalance });
      var tmpper: number = 0;

      if (symbol == token0.metadata?.symbol) {
        tmpper = (newvalue / lpToken.balance0.toNumber()) * 100;
      } else if (symbol == token1.metadata?.symbol) {
        tmpper = (newvalue / lpToken.balance1.toNumber()) * 100;
      }

      if (tmpper > 100) percentage = 100;
      else percentage = parseFloat(tmpper.toFixed(2));
      dispatch(liquidityViewActions.setRemoveAmountPercentage(percentage));

    }

  }
  return (
    <Modal
      isCentered
      isOpen={isRemoveLiquidityModalOpened}
      onClose={handleModalClose}
    >
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Heading as="h3" size="sm">
            Remove Liquidity
          </Heading>
        </ModalHeader>
        <ModalBody textAlign="center">
          <Heading as="h4" size="xs" color="gray.500" mt={2}>
            Amount
          </Heading>
          <Heading
            display="flex"
            justifyContent="center"
            alignItems="center"
            as="h6"
            size="xl"
            fontWeight="bold"
            mt={2}
            mb={4}
          >
            <Input
              w={`${String(removeAmountPercentage || 1).length * 23 + 5}px`}
              variant="unstyled"
              value={String(removeAmountPercentage || '')}
              onChange={handleInputChange}
              size="xl"
              fontWeight="bold"
              textAlign="right"
              type="number"
              step={1}
            />
            %
          </Heading>
          <Box px={6}>
            <Slider
              value={removeAmountPercentage || 1}
              onChange={handleSliderChange}
              colorScheme="dark-blue"
              focusThumbOnChange={false}
              min={1}
              max={100}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <SimpleGrid columns={4} spacing={4} py={6}>
            {PERCENTAGE_PRESETS.map((preset) => (
              <Tooltip
                key={preset}
                label={`${preset}% of your liquidity position`}
              >
                <Button
                  lineHeight="1"
                  colorScheme="dark-blue"
                  variant="outline"
                  disabled={removeAmountPercentage === preset}
                  onClick={() => handleSliderChange(preset)}
                >
                  {preset}%
                </Button>
              </Tooltip>
            ))}
          </SimpleGrid>

          <Flex alignItems="center" mx={-6}>
            <Divider />
            <Center
              p={2.5}
              borderWidth="1px"
              borderStyle="solid"
              borderColor={borderColor}
              borderRadius="md"
            >
              <FaArrowDown />
            </Center>

            <Divider />
          </Flex>

          <Stack mt={6} mb={4}>
            <RemoveLiquidityModalAsset
              {...token0.metadata}
              balance={balance0}
              isUpdating={isBalancesUpdating}
              onValueChange={onInputValueChange}
            />
            <RemoveLiquidityModalAsset
              {...token1.metadata}
              balance={balance1}
              isUpdating={isBalancesUpdating}
              onValueChange={onInputValueChange}
            />
          </Stack>

          <Flex direction="row" alignItems="center" borderRadius={5} pt={4}>
            <FormControl dir="row" alignItems="center">
              <Checkbox
                isChecked={keepInSonic}
                onChange={(e) =>
                  dispatch(
                    liquidityViewActions.setKeepInSonic(e.target.checked)
                  )
                }
                colorScheme="dark-blue"
                size="md"
                color={checkboxColor}
                fontWeight={600}
              >
                Keep tokens in Sonic after removing liquidity
              </Checkbox>
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="gradient"
            colorScheme="dark-blue"
            mb={3}
            size="lg"
            isFullWidth
            isDisabled={isAmountIsLow}
            onClick={handleRemoveLiquidity}
          >
            {buttonMessage}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
