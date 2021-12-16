import { useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import {
  depositViewActions,
  FeatureState,
  NotificationType,
  useAppDispatch,
  useDepositViewStore,
  useNotificationStore,
  useSwapStore,
} from '@/store';
import { useNavigate } from 'react-router';
import { useQuery } from '@/hooks/use-query';
import { plugCircleSrc } from '@/assets';

export const AssetsDeposit = () => {
  const query = useQuery();

  const { supportedTokenList, supportedTokenListState } = useSwapStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { amount: value, tokenId } = useDepositViewStore();
  const { addNotification } = useNotificationStore();

  const isReady = useMemo(() => value && parseFloat(value) > 0, [value]);

  const selectedTokenMetadata = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList]);

  const status = useMemo(() => {
    if (isReady) {
      return 'active';
    }

    return '';
  }, [isReady]);

  const handleTokenSelect = (tokenId: string) => {
    dispatch(depositViewActions.setTokenId(tokenId));
  };

  const handleDeposit = () => {
    addNotification({
      title: `Deposition ${selectedTokenMetadata?.symbol}`,
      type: NotificationType.Deposit,
      id: String(new Date().getTime()),
    });
  };

  useEffect(() => {
    const tokenId = query.get('tokenId');
    const fromQueryValue = query.get('amount');

    if (fromQueryValue) {
      dispatch(depositViewActions.setAmount(fromQueryValue));
    }

    if (tokenId) {
      handleTokenSelect(tokenId);
    }

    return () => {
      dispatch(depositViewActions.setAmount('0.00'));
    };
  }, []);

  return (
    <>
      <TitleBox title="Deposit Asset" onArrowBack={() => navigate('/assets')} />
      {supportedTokenListState === FeatureState.Loading &&
      !supportedTokenList ? (
        <Box my={5}>
          <TokenBox
            sources={[{ name: 'Plug Wallet', src: plugCircleSrc }]}
            isLoading
          />
        </Box>
      ) : selectedTokenMetadata ? (
        <Box my={5}>
          <TokenBox
            value={value}
            onMaxClick={() => dispatch(depositViewActions.setAmount(''))}
            setValue={(value) => dispatch(depositViewActions.setAmount(value))}
            onTokenSelect={handleTokenSelect}
            price={0}
            sources={[
              {
                name: 'Plug Wallet',
                src: plugCircleSrc,
                balance: 0,
              },
            ]}
            selectedTokenIds={[tokenId as string]}
            status={status}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={selectedTokenMetadata}
          />
        </Box>
      ) : null}
      <Button
        isFullWidth
        size="lg"
        isDisabled={!isReady}
        onClick={handleDeposit}
        isLoading={supportedTokenListState === FeatureState.Loading}
      >
        Deposit
      </Button>
    </>
  );
};
