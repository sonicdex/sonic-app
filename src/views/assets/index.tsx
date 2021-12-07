import { Text } from '@chakra-ui/layout';
import { useNavigate } from 'react-router';
import { Stack, Box } from '@chakra-ui/react';

import { FeatureState } from '@/store';
import { Asset, Header, InformationBox } from '@/components';
import {
  assetsViewActions,
  useAppDispatch,
  useAssetsView,
  useSwapStore,
} from '@/store';
import { DefaultTokensImage } from '@/constants';
import { theme } from '@/theme';

export const Assets = () => {
  useAssetsView();

  const { state: swapState, supportedTokenList } = useSwapStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navigateToDeposit = (tokenId?: string) => {
    if (tokenId) {
      dispatch(assetsViewActions.setSelectedTokenId(tokenId));
      navigate('/assets/deposit');
    }
  };

  const navigateToWithdraw = (tokenId?: string) => {
    if (tokenId) {
      dispatch(assetsViewActions.setSelectedTokenId(tokenId));
      navigate('/assets/withdraw');
    }
  };

  const isSupportedTokenListPresent =
    supportedTokenList && supportedTokenList.length > 0;

  return (
    <>
      <InformationBox title="Assets Details" mb={9}>
        <Text color="#888E8F">Assets description here</Text>
      </InformationBox>

      <Header title="Your Assets" />

      <Box
        overflow="hidden"
        height="100%"
        display="flex"
        flexDirection="column"
        position="relative"
        _after={{
          content: "''",
          position: 'absolute',
          pointerEvents: 'none',
          height: 20,
          left: 0,
          right: 0,
          bottom: -1,
          background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.bg} 100%)`,
        }}
      >
        <Stack spacing={4} overflow="auto">
          {swapState === FeatureState.Loading &&
          !isSupportedTokenListPresent ? (
            <>
              <Asset isLoading />
              <Asset isLoading />
              <Asset isLoading />
            </>
          ) : isSupportedTokenListPresent ? (
            supportedTokenList.map(({ id, name, symbol }) => (
              <Asset
                key={id}
                name={name}
                symbol={symbol}
                addLabel={`Deposit ${symbol}`}
                removeLabel={`Withdraw ${symbol}`}
                mainImgSrc={DefaultTokensImage[symbol]}
                onAdd={() => navigateToDeposit(id)}
                onRemove={() => navigateToWithdraw(id)}
              />
            ))
          ) : null}
        </Stack>
      </Box>
    </>
  );
};
