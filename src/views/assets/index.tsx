import { Text } from '@chakra-ui/layout';
import { useNavigate } from 'react-router';

import { FeatureState } from '@/store';
import { Asset, Header, InformationBox } from '@/components';
import {
  assetsViewActions,
  useAppDispatch,
  useAssetsView,
  useSwapStore,
} from '@/store';
import { Stack } from '@chakra-ui/react';
import { DefaultTokensImage } from '@/constants';

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

      <Stack spacing={4}>
        {swapState === FeatureState.Loading && !isSupportedTokenListPresent ? (
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
    </>
  );
};
