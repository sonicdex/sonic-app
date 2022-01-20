import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useTokenAllowance } from '@/hooks/use-token-allowance';
import { useSwapBatch } from '@/integrations/transactions';
import {
  modalsSliceActions,
  NotificationType,
  SwapModalDataStep,
  useAppDispatch,
  useNotificationStore,
  usePlugStore,
  useSwapViewStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';

export interface SwapLinkProps {
  id: string;
}

export const SwapLink: React.FC<SwapLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const swapViewStore = useSwapViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { principalId } = usePlugStore();
  const { getBalances } = useBalances();

  const { from, to, slippage, keepInSonic } = useMemo(() => {
    // Clone current state just for this batch
    const { from, to, slippage, keepInSonic } = swapViewStore;

    return deserialize(stringify({ from, to, slippage, keepInSonic }));
  }, []);

  const allowance = useTokenAllowance(from.metadata?.id);

  const [batch, openSwapModal] = useSwapBatch({
    from,
    to,
    slippage: Number(slippage),
    keepInSonic,
    principalId,
    allowance,
  });

  const handleStateChange = () => {
    if (
      Object.values(SwapModalDataStep).includes(
        batch.state as SwapModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setSwapModalData({
          step: batch.state as SwapModalDataStep,
        })
      );
    }
  };

  const handleOpenModal = () => {
    if (typeof allowance === 'number') {
      dispatch(modalsSliceActions.closeAllowanceVerifyModal());
      handleStateChange();
      openSwapModal();
    } else {
      dispatch(
        modalsSliceActions.setAllowanceVerifyModalData({
          tokenSymbol: from.metadata?.symbol,
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
        dispatch(modalsSliceActions.clearSwapModalData());
        dispatch(modalsSliceActions.closeSwapProgressModal());

        addNotification({
          title: `Swapped ${from.value} ${from.metadata.symbol} for ${to.value} ${to.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
        getBalances();
      })
      .catch((err) => {
        dispatch(modalsSliceActions.clearSwapModalData());

        if (err.message === 'slippage: insufficient output amount') {
          addNotification({
            title: `Slippage is too low to swap ${from.value} ${from.metadata.symbol} for ${to.value} ${to.metadata.symbol}`,
            type: NotificationType.Error,
            id: Date.now().toString(),
          });
        } else {
          addNotification({
            title: `Swap ${from.value} ${from.metadata.symbol} for ${to.value} ${to.metadata.symbol} failed`,
            type: NotificationType.Error,
            id: Date.now().toString(),
          });
        }
      })
      .finally(() => popNotification(id));
  }, [allowance]);

  return (
    <Link
      target="_blank"
      rel="noreferrer"
      color="dark-blue.500"
      onClick={handleOpenModal}
    >
      View progress
    </Link>
  );
};
