import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useTokenAllowance } from '@/hooks/use-token-allowance';
import { useDepositBatch } from '@/integrations/transactions';
import { AppTokenMetadata } from '@/models';
import {
  DepositModalDataStep,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useDepositViewStore,
  useNotificationStore,
  useSwapCanisterStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';

export interface DepositLinkProps {
  id: string;
}

export const DepositLink: React.FC<DepositLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances } = useBalances();

  const depositViewStore = useDepositViewStore();
  const swapCanisterStore = useSwapCanisterStore();

  const { supportedTokenList, value, tokenId } = useMemo(() => {
    // Clone current state just for this batch
    const { amount: value, tokenId } = depositViewStore;
    const { supportedTokenList } = swapCanisterStore;

    return deserialize(stringify({ supportedTokenList, value, tokenId }));
  }, []);

  const selectedToken = useMemo(() => {
    if (tokenId && supportedTokenList) {
      return supportedTokenList.find(
        ({ id }: AppTokenMetadata) => id === tokenId
      );
    }

    return undefined;
  }, [supportedTokenList, tokenId]);

  const allowance = useTokenAllowance(selectedToken?.id);

  const [batch, openDepositModal] = useDepositBatch({
    amount: value,
    token: selectedToken,
    allowance,
  });

  const handleStateChange = () => {
    if (
      Object.values(DepositModalDataStep).includes(
        batch.state as DepositModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setDepositModalData({
          step: batch.state as DepositModalDataStep,
        })
      );
    }
  };

  const handleOpenModal = () => {
    if (typeof allowance === 'number') {
      dispatch(modalsSliceActions.closeAllowanceVerifyModal());
      handleStateChange();
      openDepositModal();
    } else {
      dispatch(
        modalsSliceActions.setAllowanceVerifyModalData({
          tokenSymbol: selectedToken?.symbol,
        })
      );
      dispatch(modalsSliceActions.openAllowanceVerifyModal());
    }
  };

  useEffect(handleStateChange, [batch.state]);

  useEffect(() => {
    handleOpenModal();
    if (typeof allowance === 'undefined') return;
    batch
      .execute()
      .then(() => {
        dispatch(modalsSliceActions.clearDepositModalData());
        dispatch(modalsSliceActions.closeDepositProgressModal());
        getBalances();
        addNotification({
          title: `Deposited ${value} ${selectedToken?.symbol} successful`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
      })
      .catch((err) => {
        console.error('Deposit Error', err);
        dispatch(modalsSliceActions.clearDepositModalData());
        addNotification({
          title: `Deposit ${value} ${selectedToken?.symbol} failed`,
          type: NotificationType.Error,
          id: Date.now().toString(),
        });
      })
      .finally(() => popNotification(id));
  }, [allowance]);

  return (
    <Link
      target="_blank"
      rel="noreferrer"
      color="#3D52F4"
      onClick={handleOpenModal}
    >
      View progress
    </Link>
  );
};
