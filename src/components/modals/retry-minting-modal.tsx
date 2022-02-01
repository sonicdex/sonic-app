import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Link,
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
import { FaRedoAlt } from '@react-icons/all-files/fa/FaRedoAlt';
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useBalances } from '@/hooks';
import { checkIfPlugProviderVersionCompatible } from '@/integrations/plug';
import { useMintWICPBatch } from '@/integrations/transactions';
import {
  MintWICPModalDataStep,
  modalsSliceActions,
  NotificationType,
  RetryMintingToken,
  useAppDispatch,
  useModalsStore,
  useNotificationStore,
} from '@/store';

import { PLUG_WALLET_WEBSITE_URL } from '..';

const PLUG_PROVIDER_CHAINED_BATCH_VERSION = 160;

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
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();
  const [_blockHeight, setBlockHeight] = useState(String(blockHeight ?? ''));
  const [_token, setToken] = useState(token);
  const [blockHeightErrorMessage, setBlockHeightErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [tokenErrorMessage, setTokenErrorMessage] = useState<
    string | undefined
  >(undefined);

  const dispatch = useAppDispatch();

  const { batch, openBatchModal } = useMintWICPBatch({
    blockHeight: _blockHeight,
  });

  const handleStateChange = () => {
    if (
      Object.values(MintWICPModalDataStep).includes(
        batch.state as MintWICPModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setMintWICPModalData({
          step: batch.state,
        })
      );
    }
  };

  useEffect(handleStateChange, [batch.state, dispatch]);

  const handleMintXTC = useCallback(() => {
    const isVersionCompatible = checkIfPlugProviderVersionCompatible(
      PLUG_PROVIDER_CHAINED_BATCH_VERSION
    );

    if (!isVersionCompatible) {
      addNotification({
        title: (
          <>
            You're using an outdated version of Plug, please update to the
            latest one{' '}
            <Link
              color="blue.400"
              href={PLUG_WALLET_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
            .
          </>
        ),
        type: NotificationType.Error,
        id: String(new Date().getTime()),
      });

      return;
    }

    if (isVersionCompatible) {
      setBlockHeight('');
    }
  }, [addNotification]);

  const handleMintWICP = useCallback(() => {
    const isVersionCompatible = checkIfPlugProviderVersionCompatible(
      PLUG_PROVIDER_CHAINED_BATCH_VERSION
    );

    if (!isVersionCompatible) {
      addNotification({
        title: (
          <>
            You're using an outdated version of Plug, please update to the
            latest one{' '}
            <Link
              color="blue.400"
              href={PLUG_WALLET_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
            .
          </>
        ),
        type: NotificationType.Error,
        id: String(new Date().getTime()),
      });

      return;
    }

    const id = String(new Date().getTime());

    const handleOpenModal = () => {
      addNotification({
        title: (
          <>
            Minting WICP <br />{' '}
            <Link
              target="_blank"
              rel="noreferrer"
              color="dark-blue.500"
              onClick={openBatchModal}
            >
              View progress
            </Link>
          </>
        ),
        type: NotificationType.Pending,
        id,
      });

      openBatchModal();
    };

    if (isVersionCompatible) {
      batch
        .execute()
        .then(() => {
          dispatch(modalsSliceActions.closeMintWICPProgressModal());

          popNotification(id);
          addNotification({
            title: `Wrapped ICP`,
            type: NotificationType.Success,
            id: Date.now().toString(),
            transactionLink: '/activity',
          });
          getBalances();
        })
        .catch((err) => {
          console.error('Wrap Error', err);
          const isRestrictedBlockHeight =
            err?.message?.includes('Unauthorized');

          popNotification(id);
          addNotification({
            title: isRestrictedBlockHeight
              ? `Transaction index doesn't belongs to your wallet address`
              : `Wrap failed`,
            type: NotificationType.Error,
            id: Date.now().toString(),
          });
        });

      handleOpenModal();

      setBlockHeight('');
    }
  }, [addNotification]);

  const handleClose = () => {
    dispatch(modalsSliceActions.closeRetryMintingModal());
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setBlockHeightErrorMessage(undefined);
    setTokenErrorMessage(undefined);
    e.preventDefault();

    if (!_blockHeight || !_token) {
      if (!_blockHeight) {
        setBlockHeightErrorMessage('Block Height is required');
      }
      if (!_token) {
        setTokenErrorMessage('Token is required');
      }
      return;
    }
    if (_token === RetryMintingToken.XTC) {
      handleMintXTC();
    }

    if (_token === RetryMintingToken.WICP) {
      handleMintWICP();
    }

    handleClose();
  };

  const linkColor = useColorModeValue('dark-blue.500', 'dark-blue.400');

  const { activityTabURL, transactionExplorerURL } = useMemo(() => {
    return {
      activityTabURL: '',
      transactionExplorerURL: '',
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBlockHeight(e.target.value);
  };

  const blockInvalidBlockHeightChar = (e: KeyboardEvent<HTMLInputElement>) =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  return (
    <Modal isOpen={retryMintingModalOpened} onClose={handleClose} isCentered>
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
            <FormLabel>Transaction Block Height</FormLabel>

            <Input
              value={_blockHeight}
              onKeyDown={blockInvalidBlockHeightChar}
              onChange={handleChange}
              placeholder="2021024"
              type="number"
            />

            <FormErrorMessage>{blockHeightErrorMessage}</FormErrorMessage>
            <FormHelperText>
              You can find block height in your{' '}
              <Link color={linkColor} href={activityTabURL}>
                activity tab
              </Link>{' '}
              or{' '}
              <Link color={linkColor} href={transactionExplorerURL}>
                transaction explorer.
              </Link>
            </FormHelperText>
          </FormControl>
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
