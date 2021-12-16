import { useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import {
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

export const AssetsWithdraw = () => {
  const query = useQuery();
  const { amount: value, tokenId } = useWithdrawViewStore();
  const { supportedTokenList, supportedTokenListState } = useSwapStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const selectedTokenMetadata = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList, tokenId]);

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
    const amount = query.get('amount');

    if (amount) {
      dispatch(withdrawViewActions.setAmount(amount));
    }

    if (tokenId) {
      handleTokenSelect(tokenId);
    }

    return () => {
      dispatch(withdrawViewActions.setAmount('0.00'));
    };
  }, []);

  const handleWithdraw = () => {
    addNotification({
      title: `Withdrawing ${selectedTokenMetadata?.symbol}`,
      type: NotificationType.Withdraw,
      id: String(new Date().getTime()),
    });
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
            setValue={(value) => dispatch(withdrawViewActions.setAmount(value))}
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
