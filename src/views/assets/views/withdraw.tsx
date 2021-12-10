import { useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import {
  assetsViewActions,
  FeatureState,
  useAppDispatch,
  useAssetsViewStore,
  useNotificationStore,
  useSwapStore,
} from '@/store';
import { useNavigate } from 'react-router';
import { useQuery } from '@/hooks/use-query';

export const AssetsWithdraw = () => {
  const { addNotification } = useNotificationStore();
  const query = useQuery();
  const [selectedTokenId, setSelectedTokenId] = useState(query.get('tokenId'));
  const { withdrawValue } = useAssetsViewStore();
  const { supportedTokenList, state } = useSwapStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const handleTokenSelect = (tokenId: string) => {
    setSelectedTokenId(tokenId);
  };

  const handleWithdraw = () => {
    // TODO: Replace by a real withdraw
    // Withdraw token from Sonic
    addNotification({
      title: 'Withdraw successful',
      type: 'done',
      id: Date.now().toString(),
    });
  };

  return (
    <>
      <TitleBox
        title="Withdraw Asset"
        onArrowBack={() => navigate('/assets')}
      />
      {state === FeatureState.Loading && !supportedTokenList ? (
        <Box my={5}>
          <TokenBox isLoading />
        </Box>
      ) : supportedTokenList && selectedTokenId ? (
        <Box my={5}>
          <TokenBox
            value={withdrawValue}
            setValue={(value) =>
              dispatch(assetsViewActions.setWithdrawValue(value))
            }
            onTokenSelect={handleTokenSelect}
            source="sonic"
            balance="23.23"
            amount="53.23"
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
        onClick={handleWithdraw}
        isLoading={state === FeatureState.Loading}
      >
        Withdraw
      </Button>
    </>
  );
};
