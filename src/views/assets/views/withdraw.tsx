import { useEffect, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import {
  assetsViewActions,
  FeatureState,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapStore,
  useWithdrawViewStore,
  withdrawViewActions,
} from '@/store';
import { useNavigate } from 'react-router';
import { useQuery } from '@/hooks/use-query';
import { sonicCircleSrc } from '@/assets';
import { useWithdrawBatch } from '@/integrations/transactions/factories/batch/withdraw';
import { useTotalBalances } from '@/hooks/use-balances';

export const AssetsWithdraw = () => {
  const { addNotification } = useNotificationStore();
  const query = useQuery();
  const { value, tokenId } = useWithdrawViewStore();
  const { supportedTokenList, supportedTokenListState } = useSwapStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getBalances } = useTotalBalances();

  const selectedTokenMetadata = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList]);

  const isReady = useMemo(() => value && parseFloat(value) > 0, [value]);

  const status = useMemo(() => {
    if (isReady) {
      return 'active';
    }

    return '';
  }, [isReady]);

  const handleTokenSelect = (tokenId: string) => {
    dispatch(withdrawViewActions.setTokenId(tokenId));
  };

  useEffect(() => {
    const tokenId = query.get('tokenId');
    const fromQueryValue = query.get('amount');

    if (fromQueryValue) {
      dispatch(withdrawViewActions.setValue(fromQueryValue));
    }

    if (tokenId) {
      handleTokenSelect(tokenId);
    }

    return () => {
      dispatch(withdrawViewActions.setValue('0.00'));
    };
  }, []);

  const selectedToken = useMemo(() => {
    return supportedTokenList?.find((token) => token.id === tokenId);
  }, [tokenId]);

  const withdrawBatch = useWithdrawBatch({
    token: selectedToken,
    amount: value,
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
        title: `Withdraw failed ${value} ${selectedToken?.symbol}`,
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
      ) : supportedTokenList && tokenId ? (
        <Box my={5}>
          <TokenBox
            value={value}
            setValue={(value) =>
              dispatch(assetsViewActions.setWithdrawValue(value))
            }
            onTokenSelect={handleTokenSelect}
            selectedTokenIds={[tokenId]}
            status={status}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={selectedTokenMetadata}
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
