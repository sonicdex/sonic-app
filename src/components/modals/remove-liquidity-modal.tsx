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
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Tooltip,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { FaArrowDown } from 'react-icons/fa';

import {
  liquidityViewActions,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useLiquidityViewStore,
  useModalsStore,
  useNotificationStore,
  useSwapCanisterStore,
} from '@/store';
import { getCurrencyString } from '@/utils/format';
import { debounce } from '@/utils/function';

import { RemoveLiquidityModalAsset } from './remove-liquidity-modal-asset';

const PERCENTAGE_PRESETS = [25, 50, 75, 100];

export const RemoveLiquidityModal = () => {
  const dispatch = useAppDispatch();
  const { isRemoveLiquidityModalOpened } = useModalsStore();
  const { addNotification } = useNotificationStore();
  const { token0, token1, removeAmountPercentage, keepInSonic } =
    useLiquidityViewStore();
  const { allPairs, userLPBalances } = useSwapCanisterStore();

  const handleModalClose = () => {
    dispatch(modalsSliceActions.closeRemoveLiquidityModal());
  };

  const handleRemoveLiquidity = () => {
    addNotification({
      title: `Removing liquidity: ${token0.metadata?.symbol} + ${token1.metadata?.symbol}`,
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

  const balances = useMemo(() => {
    if (userLPBalances && allPairs && token0.metadata && token1.metadata) {
      const tokenBalance =
        userLPBalances[token0.metadata.id]?.[token1.metadata.id];

      const pair = allPairs[token0.metadata.id]?.[token1.metadata.id];

      if (pair) {
        const balance0 = getCurrencyString(
          new BigNumber(pair.reserve0.toString())
            .dividedBy(pair.reserve1.toString())
            .multipliedBy(tokenBalance)
            .multipliedBy(removeAmountPercentage / 100)
            .toFixed(3),
          token0.metadata.decimals
        );
        const balance1 = getCurrencyString(
          new BigNumber(pair.reserve1.toString())
            .dividedBy(pair.reserve0.toString())
            .multipliedBy(tokenBalance)
            .multipliedBy(removeAmountPercentage / 100)
            .toFixed(3),
          token1.metadata.decimals
        );

        return {
          balance0,
          balance1,
        };
      }
    }

    return { balance0: '', balance1: '' };
  }, [userLPBalances, token0, token1, removeAmountPercentage]);

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
          <Heading as="h6" size="xl" fontWeight="bold" mt={2} mb={4}>
            {removeAmountPercentage}%
          </Heading>
          <Box px={6}>
            <Slider
              value={Number(removeAmountPercentage)}
              onChange={handleSliderChange}
              colorScheme="dark-blue"
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
              borderColor="gray.700"
              borderRadius="md"
            >
              <FaArrowDown />
            </Center>

            <Divider />
          </Flex>

          <Stack mt={6} mb={4}>
            <RemoveLiquidityModalAsset
              {...token0.metadata}
              balance={balances.balance0}
            />
            <RemoveLiquidityModalAsset
              {...token1.metadata}
              balance={balances.balance1}
            />
          </Stack>

          <Flex direction="row" alignItems="center" borderRadius={5} pt={4}>
            <FormControl direction="row" alignItems="center">
              <Checkbox
                isChecked={keepInSonic}
                onChange={(e) =>
                  dispatch(
                    liquidityViewActions.setKeepInSonic(e.target.checked)
                  )
                }
                colorScheme="dark-blue"
                size="lg"
                color={keepInSonic ? '#FFFFFF' : '#888E8F'}
                fontWeight={600}
              >
                Keep tokens in Sonic after swap
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
            onClick={handleRemoveLiquidity}
          >
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
