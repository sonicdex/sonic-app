import { useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import { SupportedToken } from '@/models';
import {
  assetsViewActions,
  useAppDispatch,
  useAssetsViewStore,
  usePlugStore,
} from '@/store';
import { useNavigate } from 'react-router';

export const AssetsDeposit = () => {
  const { selectedTokenId } = useAssetsViewStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { balance } = usePlugStore();

  console.log('plug balances', balance);

  const [value, setValue] = useState('0');

  const selectedToken = useMemo(() => {
    if (selectedTokenId) {
      return {
        id: selectedTokenId,
      };
    }
    return undefined;
  }, [selectedTokenId]);
  const isReady = useMemo(() => value && parseFloat(value) > 0, [value]);
  const status = useMemo(() => {
    if (isReady) {
      return 'active';
    }

    return '';
  }, [isReady]);

  const handleTokenSelect = (TokenId: string) => {
    console.log(TokenId);
    dispatch(assetsViewActions.setSelectedTokenId(TokenId));
  };

  const handleDeposit = () => {
    // Integration:
    // Deposit token to Sonic
  };

  return (
    <>
      <TitleBox title="Deposit Asset" onArrowBack={() => navigate('/assets')} />
      <Box my={5}>
        <TokenBox
          value={value}
          setValue={setValue}
          onTokenSelect={handleTokenSelect}
          source="plug"
          balance="23.23"
          amount="53.23"
          status={status}
          currentToken={selectedToken as SupportedToken}
        />
      </Box>
      <Button
        isFullWidth
        size="lg"
        isDisabled={!isReady}
        onClick={handleDeposit}
      >
        Deposit
      </Button>
    </>
  );
};
