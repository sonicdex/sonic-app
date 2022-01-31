import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FormEvent, useState } from 'react';

import {
  modalsSliceActions,
  RetryMintingToken,
  useAppDispatch,
  useModalsStore,
} from '@/store';

const TOKEN_OPTIONS = [
  {
    label: 'WICP',
    value: RetryMintingToken.WICP,
  },
  {
    label: 'XTC',
    value: RetryMintingToken.XTC,
  },
];

export const RetryMintingModal = () => {
  const color = useColorModeValue('gray.600', 'gray.400');

  const {
    retryMintingModalOpened,
    retryMintingModalData: { token, blockHeight } = {},
  } = useModalsStore();

  const [_blockHeight, setBlockHeight] = useState(String(blockHeight ?? ''));
  const [blockHeightErrorMessage, setBlockHeightErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [_token, setToken] = useState(token);
  const [tokenErrorMessage, setTokenErrorMessage] = useState<
    string | undefined
  >(undefined);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(modalsSliceActions.closeRetryMintingModal());
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!_blockHeight || !_token) {
      if (!_blockHeight) {
        setBlockHeightErrorMessage('Block height is required');
      }
      if (!_token) {
        setTokenErrorMessage('Token is required');
      }
      return;
    }
  };

  return (
    <Modal isOpen={retryMintingModalOpened} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit} noValidate>
        <ModalCloseButton />
        <ModalHeader>
          Retry minting{' '}
          <Text textAlign="center" fontSize="sm" color={color}>
            Using this form you can retry any of your failed mint transactions.
          </Text>
        </ModalHeader>
        <ModalBody as={Stack}>
          <FormControl
            name="token"
            isRequired
            isInvalid={Boolean(tokenErrorMessage)}
          >
            <FormLabel>Token</FormLabel>
            <Select
              value={_token}
              onChange={(e) => setToken(e.target.value as RetryMintingToken)}
            >
              {TOKEN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{tokenErrorMessage}</FormErrorMessage>
          </FormControl>

          <FormControl
            name="blockHeight"
            isRequired
            isInvalid={Boolean(blockHeightErrorMessage)}
          >
            <FormLabel>Block height</FormLabel>

            <Input
              value={_blockHeight}
              onChange={(e) => setBlockHeight(e.target.value)}
              placeholder="2021024"
            />

            <FormErrorMessage>{blockHeightErrorMessage}</FormErrorMessage>
            <FormHelperText>
              You can find block height in your activity tab or transaction
              explorer.
            </FormHelperText>
          </FormControl>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button type="submit" variant="gradient" colorScheme="dark-blue">
            Submit
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
