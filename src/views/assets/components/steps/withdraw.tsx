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

export const WithdrawStep = () => {
  const { selectedTokenName } = useAssetsViewStore();
  const dispatch = useAppDispatch();

  const selectedToken = useMemo(() => {
    if (selectedTokenName) {
      return getTokenFromAsset(selectedTokenName);
    }
    return undefined;
  }, []);

  const [value, setValue] = useState('0');

  const isReady = value && parseFloat(value) > 0;
  const getStatus = () => (isReady ? 'active' : '');

  const handleTokenSelect = (tokenName: string) => {
    dispatch(assetsViewActions.setSelectedTokenName(tokenName));
  };

  const handleWithdraw = () => {
    // Integration:
    // Deposit token to Sonic
  };

  return (
    <>
      <TitleBox
        title="Withdraw Asset"
        onArrowBack={() => dispatch(assetsViewActions.setStep(AssetStep.Home))}
      />
      <Box my={5}>
        <TokenBox
          value={value}
          setValue={setValue}
          onTokenSelect={handleTokenSelect}
          source="sonic"
          balance="23.23"
          amount="53.23"
          status={getStatus()}
          // TODO: Fix types
          tokenOptions={Object.values(TOKEN) as SupportedToken[]}
          currentToken={selectedToken as SupportedToken}
        />
      </Box>
      <Button
        title="Withdraw"
        status={isReady ? undefined : 'disabled'}
        onClick={handleWithdraw}
        borderRadius={20}
        fontWeight={700}
        fontSize={22}
      />
    </>
  );
};
