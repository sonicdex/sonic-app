import { UseDisclosureReturn } from '@chakra-ui/hooks';
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
  Button as ChakraButton,
  Center,
  Divider,
  Flex,
  Heading,
  Stack,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from '@chakra-ui/react';
import { FaArrowDown } from 'react-icons/fa';
import { Button } from '@/components';
import { RemoveLiquidityModalAsset } from './remove-liquidity-modal-asset';
import {
  liquidityViewActions,
  NotificationType,
  useAppDispatch,
  useLiquidityViewStore,
  useNotificationStore,
} from '@/store';
import { debounce } from '@/utils/function';

type RemoveLiquidityModalProps = UseDisclosureReturn;

const PERCENTAGE_PRESETS = [25, 50, 75, 100];

// TODO: Replace mocks by liquidity data
export const RemoveLiquidityModal = ({
  isOpen,
  onClose,
}: RemoveLiquidityModalProps) => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotificationStore();
  const { token0, token1, removeAmountPercentage } = useLiquidityViewStore();

  const handleRemoveLiquidity = () => {
    addNotification({
      title: `Adding liquidity: ${token0.metadata?.symbol} + ${token1.metadata?.symbol}`,
      type: NotificationType.RemoveLiquidity,
      id: String(new Date().getTime()),
    });
    debounce(() => {
      dispatch(liquidityViewActions.setRemoveAmountPercentage(0));
    }, 300);
  };

  const handleSliderChange = (value: number) => {
    dispatch(liquidityViewActions.setRemoveAmountPercentage(value));
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Heading as="h3" size="sm">
            Remove Liquidity
          </Heading>
        </ModalHeader>
        <ModalBody textAlign="center">
          <Heading as="h4" size="xs" color="gray.500">
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
                <ChakraButton
                  lineHeight="1"
                  colorScheme="dark-blue"
                  variant="outline"
                  onClick={() => handleSliderChange(preset)}
                >
                  {preset}%
                </ChakraButton>
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

          <Stack spacing={4}>
            <RemoveLiquidityModalAsset
              symbol="XTC"
              balance={5418.12}
              price={5418.12}
            />
            <RemoveLiquidityModalAsset
              symbol="WICP"
              balance={5418.12}
              price={5418.12}
            />
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button mb={3} size="lg" isFullWidth onClick={handleRemoveLiquidity}>
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
