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

import { ENV } from '@/config';
import { checkIfPlugProviderVersionCompatible } from '@/integrations/plug';
import {
  MintTokenSymbol,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';

import { PLUG_WALLET_WEBSITE_URL } from '..';

const PLUG_PROVIDER_CHAINED_BATCH_VERSION = 160;

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
      const isVersionCompatible = checkIfPlugProviderVersionCompatible(
        PLUG_PROVIDER_CHAINED_BATCH_VERSION
      );

      if (!isVersionCompatible) {
        addNotification({
          title: (
            <>
              You're using an outdated version of Plug, please update to the
              latest one&nbsp;
              <ChakraLink
                color="blue.400"
                href={PLUG_WALLET_WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </ChakraLink>
              .
            </>
          ),
          type: NotificationType.Error,
          id: String(new Date().getTime()),
        });

        return;
      }

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

  const linkColor = useColorModeValue('dark-blue.500', 'dark-blue.400');

  const { activityTabURL, learnMoreURL } = useMemo(() => {
    return {
      activityTabURL: '/activity',
      learnMoreURL: `${ENV.URLs.sonicDocs}/product/swap/failed-swaps#failed-mints`,
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
          <FormControl
            name="token"
            isRequired
            isInvalid={Boolean(tokenErrorMessage)}
          >
            <FormLabel>Token</FormLabel>
            <Select
              value={mintManualTokenSymbol}
              onChange={handleTokenSymbolSelect}
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
            <FormLabel>Transaction Block Height</FormLabel>

            <Input
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
          <Button
            leftIcon={<FaRedoAlt />}
            isFullWidth
            type="submit"
            variant="gradient"
            colorScheme="dark-blue"
          >
            Retry
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
