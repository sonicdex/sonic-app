import { useEffect, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import {
  assetsViewActions,
  FeatureState,
  NotificationType,
  useAppDispatch,
  useAssetsViewStore,
  useNotificationStore,
  useSwapStore,
} from '@/store';
import { useNavigate } from 'react-router';
import { useQuery } from '@/hooks/use-query';
import { sonicCircleSrc } from '@/assets';
import { useWithdrawBatch } from '@/integrations/transactions/factories/batch/withdraw';
import { useTotalBalances } from '@/hooks/use-balances';

export const AssetsWithdraw = () => {
  const { addNotification } = useNotificationStore();
  const query = useQuery();
  const [selectedTokenId, setSelectedTokenId] = useState(query.get('tokenId'));
  const { withdrawValue } = useAssetsViewStore();
  const { supportedTokenList, supportedTokenListState } = useSwapStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getBalances } = useTotalBalances();

  const isReady = useMemo(
    () => withdrawValue && parseFloat(withdrawValue) > 0,
    [withdrawValue]
  );

  const status = useMemo(() => {
    if (isReady) {
      return 'active';
    }

    return '';
  }, [isReady]);

  useEffect(() => {
    const fromQueryValue = query.get('amount');
    if (fromQueryValue) {
      dispatch(assetsViewActions.setWithdrawValue(fromQueryValue));
    }

    return () => {
      dispatch(assetsViewActions.setWithdrawValue('0.00'));
    };
  }, []);

  const handleTokenSelect = (tokenId: string) => {
    setSelectedTokenId(tokenId);
  };

  const selectedToken = useMemo(() => {
    return supportedTokenList?.find((token) => token.id === selectedTokenId);
  }, [selectedTokenId]);

  const withdrawBatch = useWithdrawBatch({
    token: selectedToken,
    amount: withdrawValue,
  });

  const handleWithdraw = async () => {
    try {
      await withdrawBatch.execute();

      addNotification({
        title: 'Withdraw successful',
        type: NotificationType.Done,
        id: Date.now().toString(),
      });

      getBalances();
    } catch (error) {
      addNotification({
        title: `Withdraw failed ${withdrawValue} ${selectedToken?.symbol}`,
        type: NotificationType.Error,
        id: Date.now().toString(),
      });
    }
  };

  return (
    <>
      <TitleBox
        title="Withdraw Asset"
        onArrowBack={() => navigate('/assets')}
      />
      {supportedTokenListState === FeatureState.Loading &&
      !supportedTokenList ? (
        <Box my={5}>
          <TokenBox
            sources={[{ name: 'Sonic', src: sonicCircleSrc }]}
            isLoading
          />
        </Box>
      ) : supportedTokenList && selectedTokenId ? (
        <Box my={5}>
          <TokenBox
            value={withdrawValue}
            setValue={(value) =>
              dispatch(assetsViewActions.setWithdrawValue(value))
            }
            onTokenSelect={handleTokenSelect}
            selectedTokenIds={[selectedTokenId]}
            status={status}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={supportedTokenList.find(
              ({ id }) => id === selectedTokenId
            )}
            price={0}
            sources={[
              {
                name: 'Sonic',
                src: sonicCircleSrc,
                balance: 0,
              },
            ]}
          />
        </Box>
      ) : null}

      <Button
        isFullWidth
        size="lg"
        isDisabled={!isReady}
        onClick={handleWithdraw}
        isLoading={supportedTokenListState === FeatureState.Loading}
      >
        Withdraw
      </Button>
    </>
  );
};
