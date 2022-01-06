import { Box, Flex, Modal, ModalOverlay } from '@chakra-ui/react';
import { useMemo } from 'react';

import { checkPlainSrc } from '@/assets';
import { modalsSliceActions, useAppDispatch, useModalsStore } from '@/store';

import { StepStatus } from '.';
import { TransactionProgressModalContent, TransactionStep } from './components';

export const AllowanceVerifyModal = () => {
  const dispatch = useAppDispatch();
  const {
    isAllowanceVerifyModalOpened,
    allowanceModalData: { tokenSymbol },
  } = useModalsStore();

  const _tokenSymbol = useMemo(() => {
    if (!tokenSymbol) {
      return ['token'];
    } else if (typeof tokenSymbol === 'string') {
      return [tokenSymbol];
    } else {
      return tokenSymbol;
    }
  }, [tokenSymbol]);

  const handleClose = () => {
    dispatch(modalsSliceActions.closeAllowanceVerifyModal());
  };

  return (
    <Modal
      onClose={handleClose}
      isOpen={isAllowanceVerifyModalOpened}
      isCentered
    >
      <ModalOverlay />
      <TransactionProgressModalContent title="Verifying Allowance">
        <Flex alignItems="flex-start">
          {_tokenSymbol.map((symbol) => (
            <TransactionStep
              status={StepStatus.Active}
              iconSrc={checkPlainSrc}
              key={symbol}
            >
              <Box mx={6}>
                Verifying {symbol} <br /> allowance
              </Box>
            </TransactionStep>
          ))}
        </Flex>
      </TransactionProgressModalContent>
    </Modal>
  );
};
