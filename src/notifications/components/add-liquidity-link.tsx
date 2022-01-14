import { Link } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { useBalances } from '@/hooks/use-balances';
import { useTokenAllowance } from '@/hooks/use-token-allowance';
import { useAddLiquidityBatch } from '@/integrations/transactions';
import {
  AddLiquidityModalDataStep,
  modalsSliceActions,
  NotificationType,
  useAppDispatch,
  useLiquidityViewStore,
  useNotificationStore,
} from '@/store';
import { deserialize, stringify } from '@/utils/format';

export interface AddLiquidityLinkProps {
  id: string;
}

export const AddLiquidityLink: React.FC<AddLiquidityLinkProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const liquidityViewStore = useLiquidityViewStore();
  const { addNotification, popNotification } = useNotificationStore();
  const { getBalances, getUserPositiveLPBalances } = useBalances();

  const { token0, token1, slippage } = useMemo(() => {
    // Clone current state just for this batch
    const { token0, token1, slippage, pair } = liquidityViewStore;

    // Is needed to send to canister the values in the pair id order
    if (pair) {
      const token0Id = pair.id.split(':')[0];
      if (token0Id !== token0.metadata?.id) {
        return deserialize(
          stringify({ token0: token1, token1: token0, slippage })
        );
      }
    }

    return deserialize(stringify({ token0, token1, slippage }));
  }, []);

  const allowance0 = useTokenAllowance(token0.metadata?.id);
  const allowance1 = useTokenAllowance(token1.metadata?.id);

  const [batch, openAddLiquidityModal] = useAddLiquidityBatch({
    token0,
    token1,
    slippage: Number(slippage),
  });

  const handleStateChange = () => {
    if (
      Object.values(AddLiquidityModalDataStep).includes(
        batch.state as AddLiquidityModalDataStep
      )
    ) {
      dispatch(
        modalsSliceActions.setAddLiquidityModalData({
          step: batch.state as AddLiquidityModalDataStep,
        })
      );
    }
  };

  const handleOpenModal = () => {
    if (typeof allowance0 === 'number' && typeof allowance1 === 'number') {
      dispatch(modalsSliceActions.closeAllowanceVerifyModal());
      handleStateChange();
      openAddLiquidityModal();
    } else {
      dispatch(
        modalsSliceActions.setAllowanceVerifyModalData({
          tokenSymbol: [token0.metadata?.symbol, token1.metadata?.symbol],
        })
      );
      dispatch(modalsSliceActions.openAllowanceVerifyModal());
    }
  };

  useEffect(handleStateChange, [batch.state]);

  useEffect(() => {
    handleOpenModal();
    if (typeof allowance0 === 'undefined' || typeof allowance1 === 'undefined')
      return;
    batch
      .execute()
      .then(() => {
        dispatch(modalsSliceActions.clearAddLiquidityModalData());
        dispatch(modalsSliceActions.closeAddLiquidityProgressModal());
        addNotification({
          title: `Added LP of ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol}`,
          type: NotificationType.Success,
          id: Date.now().toString(),
          transactionLink: '/activity',
        });
        getBalances();
        getUserPositiveLPBalances();
      })
      .catch((err) => {
        console.error('Add Liquidity Error', err);
        dispatch(modalsSliceActions.clearAddLiquidityModalData());
        addNotification({
          title: `Add LP of ${token0.value} ${token0.metadata.symbol} + ${token1.value} ${token1.metadata.symbol} failed`,
          type: NotificationType.Error,
          id: Date.now().toString(),
        });
      })
      .finally(() => popNotification(id));
  }, [allowance0, allowance1]);

  return (
    <Link
      target="_blank"
      rel="noreferrer"
      color="dark-gray.500"
      onClick={handleOpenModal}
    >
      View progress
    </Link>
  );
};
