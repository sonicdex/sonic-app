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
import { plugCircleSrc } from '@/assets';

export const AssetsDeposit = () => {
  const { addNotification } = useNotificationStore();
  const query = useQuery();
  const [selectedTokenId, setSelectedTokenId] = useState(query.get('tokenId'));

  const { supportedTokenList, supportedTokenListState } = useSwapStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { depositValue } = useAssetsViewStore();

  const isReady = useMemo(
    () => depositValue && parseFloat(depositValue) > 0,
    [depositValue]
  );

  const status = useMemo(() => {
    if (isReady) {
      return 'active';
    }

    return '';
  }, [isReady]);

  const handleTokenSelect = (tokenId: string) => {
    setSelectedTokenId(tokenId);
  };

  const handleDeposit = () => {
    // TODO: replace by real deposit logic
    addNotification({
      title: 'Deposit successful',
      type: NotificationType.Done,
      id: Date.now().toString(),
    });
  };

  useEffect(() => {
    const fromQueryValue = query.get('amount');
    if (fromQueryValue) {
      dispatch(assetsViewActions.setDepositValue(fromQueryValue));
    }

    return () => {
      dispatch(assetsViewActions.setDepositValue('0.00'));
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
      ) : supportedTokenList && selectedTokenId ? (
        <Box my={5}>
          <TokenBox
            value={depositValue}
            onMaxClick={() => dispatch(assetsViewActions.setDepositValue(''))}
            setValue={(value) =>
              dispatch(assetsViewActions.setDepositValue(value))
            }
            onTokenSelect={handleTokenSelect}
            price={53.23}
            sources={[
              {
                name: 'Plug Wallet',
                src: plugCircleSrc,
                balance: 0,
              },
            ]}
            selectedTokenIds={[selectedTokenId]}
            status={status}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={supportedTokenList.find(
              ({ id }) => id === selectedTokenId
            )}
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
