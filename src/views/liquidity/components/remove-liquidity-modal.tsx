import { useState } from 'react';
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
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from '@chakra-ui/react';
import { FaArrowDown } from 'react-icons/fa';

type RemoveLiquidityModalProps = UseDisclosureReturn;

const percentagePresets = [25, 50, 75, 100];

export const RemoveLiquidityModal = ({
  isOpen,
  onClose,
}: RemoveLiquidityModalProps) => {
  const [value, setValue] = useState(0);

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
            {value}%
          </Heading>
          <Box px={6}>
            <Slider value={value} onChange={setValue} colorScheme="dark-blue">
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <SimpleGrid columns={4} spacing={4} py={6}>
            {percentagePresets.map((preset) => (
              <Tooltip
                key={preset}
                label={`Remove ${preset}% of liquidity position`}
              >
                <Button
                  colorScheme="dark-blue"
                  variant="outline"
                  onClick={() => setValue(preset)}
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
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
