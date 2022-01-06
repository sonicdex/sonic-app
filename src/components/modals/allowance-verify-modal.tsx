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

  const tokenSymbols = useMemo(() => {
    if (!tokenSymbol) {
      return [''];
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
          {tokenSymbols.map((tokenSymbol) => (
            <TransactionStep
              status={StepStatus.Active}
              iconSrc={checkPlainSrc}
              key={tokenSymbol}
            >
              <Box mx={6}>
                Verifying {tokenSymbol || ''} <br /> allowance
              </Box>
            </TransactionStep>
          ))}
        </Flex>
      </TransactionProgressModalContent>
    </Modal>
  );
};
