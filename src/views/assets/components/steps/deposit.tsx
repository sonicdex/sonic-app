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
  }, []);

  const isReady = value && parseFloat(value) > 0;
  const getStatus = () => (isReady ? 'active' : '');

  const handleTokenSelect = (tokenName: string) => {
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
        title="Deposit"
        status={isReady ? undefined : 'disabled'}
        onClick={handleDeposit}
        borderRadius={20}
        fontWeight="bold"
        fontSize="xl"
      />
    </>
  );
};
