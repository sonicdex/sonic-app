import { useState } from 'react';
import { UseDisclosureReturn } from '@chakra-ui/hooks';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalHeader,
} from '@chakra-ui/modal';
import {
  Box,
  Button,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Heading,
  ModalCloseButton,
} from '@chakra-ui/react';

type RemoveLiquidityModalProps = UseDisclosureReturn;

const percentagePresets = [25, 50, 75, 100];

export const RemoveLiquidityModal = ({
  isOpen,
  onClose,
}: RemoveLiquidityModalProps) => {
  const [value, setValue] = useState(0);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
              <Button
                colorScheme="dark-blue"
                variant="outline"
                onClick={() => setValue(preset)}
              >
                {preset}%
              </Button>
            ))}
          </SimpleGrid>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
