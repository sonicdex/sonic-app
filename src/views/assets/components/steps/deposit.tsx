import { useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import { TOKEN } from '@/constants';
import { SupportedToken } from '@/models';
import {
  AssetStep,
  assetsViewActions,
  useAppDispatch,
  useAssetsViewStore,
} from '@/store';
import { getTokenFromAsset } from './utils';

export const DepositStep = () => {
  const { selectedTokenName } = useAssetsViewStore();
  const dispatch = useAppDispatch();

  const [value, setValue] = useState('0');

  const selectedToken = useMemo(() => {
    if (selectedTokenName) {
      return getTokenFromAsset(selectedTokenName);
    }
    return undefined;
  }, [selectedTokenName]);
  const isReady = useMemo(() => value && parseFloat(value) > 0, [value]);

  const getStatus = () => (isReady ? 'active' : '');

  const handleTokenSelect = (tokenName: string) => {
    console.log(tokenName);
    dispatch(assetsViewActions.setSelectedTokenName(tokenName));
  };

  const handleDeposit = () => {
    // Integration:
    // Deposit token to Sonic
  };

  return (
    <>
      <TitleBox
        title="Deposit Asset"
        onArrowBack={() => dispatch(assetsViewActions.setStep(AssetStep.Home))}
      />
      <Box my={5}>
        <TokenBox
          value={value}
          setValue={setValue}
          onTokenSelect={handleTokenSelect}
          source="plug"
          balance="23.23"
          amount="53.23"
          status={getStatus()}
          // TODO: Fix types
          tokenOptions={Object.values(TOKEN) as SupportedToken[]}
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
