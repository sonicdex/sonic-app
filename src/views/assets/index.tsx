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

  const moveToDeposit = (TokenId?: string) => {
    if (TokenId) {
      dispatch(assetsViewActions.setSelectedTokenId(TokenId));
      navigate('/assets/deposit');
    }
  };

  const moveToWithdraw = (TokenId?: string) => {
    if (TokenId) {
      dispatch(assetsViewActions.setSelectedTokenId(TokenId));
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
          supportedTokenList.map(({ name, symbol }) => (
            <Asset
              key={name}
              title={name}
              mainImgSrc={DefaultTokensImage[symbol]}
              onAdd={() => moveToDeposit(name)}
              onRemove={() => moveToWithdraw(name)}
            />
          ))
        ) : null}
      </Stack>
    </>
  );
};
