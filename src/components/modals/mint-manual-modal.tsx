import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Link as ChakraLink,
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
  useConst,
} from '@chakra-ui/react';
import { FaRedoAlt } from '@react-icons/all-files/fa/FaRedoAlt';
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';


import {
  MintTokenSymbol,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';
import { ExternalLink } from '@/utils';


export const MintManualModal = () => {
  const TOKEN_OPTIONS = useConst([
    {
      label: MintTokenSymbol.WICP,
      value: MintTokenSymbol.WICP,
    },
    {
      label: MintTokenSymbol.XTC,
      value: MintTokenSymbol.XTC,
    },
  ]);
  const color = useColorModeValue('gray.600', 'gray.400');

  const {
    mintManualModalOpened,
    mintManualBlockHeight,
    mintManualTokenSymbol,
    mintManualModalErrorMessage,
  } = useModalsStore();
  const { addNotification } = useNotificationStore();

  const [blockHeightErrorMessage, setBlockHeightErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [tokenErrorMessage, setTokenErrorMessage] = useState<
    string | undefined
  >(undefined);

  const dispatch = useAppDispatch();

  const handleMint = useCallback(
    (tokenSymbol: MintTokenSymbol) => {
      addNotification({
        title: `Minting ${tokenSymbol}`,
        type: NotificationType.MintManual,
        id: String(new Date().getTime()),
      });
    },
    [addNotification]
  );

  const resetModalData = () => {
    dispatch(modalsSliceActions.setMintManualModalErrorMessage(''));
    setBlockHeightErrorMessage(undefined);
    setTokenErrorMessage(undefined);
  };

  const handleClose = () => {
    resetModalData();
    dispatch(modalsSliceActions.closeMintManualModal());
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    resetModalData();
    e.preventDefault();

    if (!mintManualBlockHeight || !mintManualTokenSymbol) {
      if (!mintManualBlockHeight) {
        setBlockHeightErrorMessage('Block Height is required');
      }
      if (!mintManualTokenSymbol) {
        setTokenErrorMessage('Token is required');
      }
      return;
    }

    handleMint(mintManualTokenSymbol);

    handleClose();
  };

  const linkColor = useColorModeValue('green.500', 'green.400');

  const { activityTabURL, learnMoreURL } = useMemo(() => {
    return {
      activityTabURL: '/activity',
      learnMoreURL: ExternalLink.failedMintDocs,
    };
  }, []);

  const handleBlockHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(modalsSliceActions.setMintManualBlockHeight(e.target.value));
  };

  const handleTokenSymbolSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      modalsSliceActions.setMintManualTokenSymbol(
        e.target.value as MintTokenSymbol
      )
    );
  };

  const blockInvalidBlockHeightChar = (e: KeyboardEvent<HTMLInputElement>) =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  return (
    <Modal isOpen={mintManualModalOpened} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit} noValidate>
        <ModalCloseButton />
        <ModalHeader borderBottom="none">
          Retry minting{' '}
          <Text textAlign="center" fontSize="sm" color={color}>
            Use this form to retry any of your failed mints.
          </Text>
        </ModalHeader>
        <ModalBody as={Stack} spacing={4}>
          <FormControl isRequired isInvalid={Boolean(tokenErrorMessage)}>
            <FormLabel>Token</FormLabel>
            <Select
              name="token"
              value={mintManualTokenSymbol}
              onChange={handleTokenSymbolSelect}
              colorScheme="green"
              _focus={{ borderColor:"#0b361d" , boxShadow : "0 0 0 1px #0b361d"}}
            >
              {TOKEN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{tokenErrorMessage}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(blockHeightErrorMessage)}>
            <FormLabel>Transaction Block Height</FormLabel>

            <Input
              name="blockHeight"
              value={mintManualBlockHeight}
              onKeyDown={blockInvalidBlockHeightChar}
              onChange={handleBlockHeightChange}
              placeholder="2021024"
              type="number"
            />

            <FormErrorMessage>{blockHeightErrorMessage}</FormErrorMessage>
            <FormHelperText>
              Visit your&nbsp;
              <ChakraLink
                as={Link}
                color={linkColor}
                to={activityTabURL}
                onClick={handleClose}
              >
                activity tab
              </ChakraLink>
              &nbsp;to find your failed transactions blockheight. Learn more
              about failed mints&nbsp;
              <ChakraLink
                target="_blank"
                rel="noopener noreferrer"
                color={linkColor}
                href={learnMoreURL}
              >
                here
              </ChakraLink>
              .
            </FormHelperText>
          </FormControl>
          {mintManualModalErrorMessage && (
            <Text textAlign="center" fontSize="sm" color="red.500">
              {mintManualModalErrorMessage}
            </Text>
          )}
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button leftIcon={<FaRedoAlt />} isFullWidth type="submit" variant="gradient" colorScheme="green">
            Retry
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
