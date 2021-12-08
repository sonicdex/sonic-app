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

export const AssetsDeposit = () => {
  const { addNotification } = useNotificationStore();
  const query = useQuery();
  const [selectedTokenId, setSelectedTokenId] = useState(query.get('tokenId'));

  const { supportedTokenList, state } = useSwapStore();

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
      type: 'done',
      id: Date.now().toString(),
    });
  };

  return (
    <>
      <TitleBox title="Deposit Asset" onArrowBack={() => navigate('/assets')} />
      {state === FeatureState.Loading && !supportedTokenList ? (
        <Box my={5}>
          <TokenBox source="plug" isLoading />
        </Box>
      ) : supportedTokenList && selectedTokenId ? (
        <Box my={5}>
          <TokenBox
            value={depositValue}
            setValue={(value) =>
              dispatch(assetsViewActions.setDepositValue(value))
            }
            onTokenSelect={handleTokenSelect}
            source="plug"
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
        onClick={handleDeposit}
        isLoading={state === FeatureState.Loading}
      >
        Deposit
      </Button>
    </>
  );
};
