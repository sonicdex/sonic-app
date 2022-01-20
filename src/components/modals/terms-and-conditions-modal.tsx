import {
  Button,
  Link,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

export const TermsAndConditionsModal = () => {
  const dispatch = useAppDispatch();
  const {
    isTermsAndConditionsModalOpened: isOpened,
    termsAndConditionsModalData: {
      callbacks: [successCallback, closeCallback] = [],
    },
  } = useModalsStore();

  const handleClose = () => {
    if (closeCallback) closeCallback();
    dispatch(modalsSliceActions.closeTermsAndConditionsModal());
  };

  return (
    <Modal onClose={handleClose} isOpen={isOpened} isCentered>
      <ModalOverlay />

      <ModalContent
        alignItems="center"
        borderRadius={20}
        minWidth="fit-content"
      >
        <ModalCloseButton />
        <ModalHeader borderBottom="none">Terms and Conditions</ModalHeader>
        <Text as="p" color="custom.1" maxW={370}>
          Please read &nbsp;
          <Link color="dark-blue.600">Sonic's terms & conditions</Link>
          &nbsp;carefully.
          <br />
          By clicking "I agree" you acknowledge that you have read and accepted
          them.
        </Text>
        <ModalFooter width="full">
          <Button
            onClick={successCallback}
            width="full"
            colorScheme="dark-blue"
            variant="gradient"
          >
            I agree
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
