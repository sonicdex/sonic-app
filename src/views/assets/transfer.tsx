import { Box, Button, Skeleton, Input, Text } from '@chakra-ui/react';
import { toBigNumber } from '@memecake/sonic-js';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import {
  Token, TokenContent, TokenData, TokenDataBalances, TokenDataPrice, TokenDetailsButton,
  TokenDetailsLogo, TokenDetailsSymbol, TokenDataMetaInfo, TokenInput, ViewHeader,
} from '@/components';

import { FeeBox } from '@/components/core/fee-box';

import { useQuery } from '@/hooks/use-query';

import {
  transferViewActions, FeatureState, NotificationType, useAppDispatch, useTransferViewStore,
  useNotificationStore, useSwapCanisterStore, useTokenModalOpener, useWalletStore
} from '@/store';

import { getMaxValue } from '@/utils/format';
import { debounce } from '@/utils/function';

import { tokenList } from '@/utils';

import { artemis } from '@/integrations/artemis';


export const AssetsTransferView = () => {
  const query = useQuery();
  const { supportedTokenList, tokenBalances, balancesState, supportedTokenListState } = useSwapCanisterStore();
  const { isConnected } = useWalletStore()

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { amount, tokenId , } = useTransferViewStore();

  const { addNotification } = useNotificationStore();
  const openSelectTokenModal = useTokenModalOpener();

  const selectedTokenMetadata = tokenList('obj')[tokenId ? tokenId : ''];


  const handleSelectTokenId = (tokenId?: string) => {
    if (tokenId) {
      dispatch(transferViewActions.setTokenId(tokenId));
    }
  };
  
  const handleOpenSelectTokenModal = () => {
    openSelectTokenModal({ metadata: supportedTokenList, onSelect: (tokenId) => handleSelectTokenId(tokenId), selectedTokenIds: [] });
  };

  const handleDeposit = () => {
    addNotification({
      title: `Deposit ${amount} ${selectedTokenMetadata?.symbol}`,
      type: NotificationType.Deposit,
      id: String(new Date().getTime()),
    });
    debounce(() => dispatch(transferViewActions.setAmount('')), 300);
  };

  const handleMaxClick = () => {
    if (tokenBalance && selectedTokenMetadata)
      dispatch(
        transferViewActions.setAmount(
          getMaxValue(selectedTokenMetadata, tokenBalance, true).toString()
        )
      );
  };

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (!isConnected) return [true, 'Connect wallet'];
    if (!selectedTokenMetadata?.id) return [true, 'Select a Token'];

    const parsedFromValue = (amount && parseFloat(amount)) || 0;

    if (parsedFromValue <= 0)
      return [true, `Enter ${selectedTokenMetadata?.symbol} Amount`];

    if (
      parsedFromValue <=
      toBigNumber(selectedTokenMetadata.fee).applyDecimals(selectedTokenMetadata.decimals).toNumber()
    ) {
      return [true, `Amount must be greater than fee`];
    }

    if (tokenBalances && selectedTokenMetadata) {
      if (
        parsedFromValue >
        getMaxValue(selectedTokenMetadata, tokenBalances[selectedTokenMetadata.id], true).toNumber()
      ) {
        return [true, `Insufficient ${selectedTokenMetadata.symbol} Balance`];
      }
    }

    return [false, 'Deposit'];
  }, [amount, tokenBalances, selectedTokenMetadata]);

  const tokenBalance = useMemo(() => {
    if (tokenBalances && tokenId) {
      return tokenBalances[tokenId];
    }

    return 0;
  }, [tokenBalances, tokenId]);

  const isLoading = useMemo(() =>
    supportedTokenListState === FeatureState.Loading ||
    balancesState === FeatureState.Loading,
    [supportedTokenListState, balancesState]
  );

  useEffect(() => {
    const tokenId = query.get('tokenId');
    const fromQueryValue = query.get('amount');

    if (fromQueryValue) {
      dispatch(transferViewActions.setAmount(fromQueryValue));
    }

    if (tokenId) {
      handleSelectTokenId(tokenId);
    }

    return () => {
      dispatch(transferViewActions.setAmount(''));
    };
  }, []);

  var connectedWalletInfo = artemis.connectedWalletInfo;

  return (
    <>
      <ViewHeader title={"Transfer " + selectedTokenMetadata?.symbol + ''} onArrowBack={() => navigate('/assets')} />
      <Box my={5}>
        <Token
          isLoading={isLoading}
          value={amount}
          setValue={(value) => dispatch(transferViewActions.setAmount(value))}
          sources={[
            {
              name: connectedWalletInfo?.name,
              src: connectedWalletInfo?.icon,
              balance: tokenBalance,
            },
          ]}
          tokenListMetadata={supportedTokenList}
          tokenMetadata={selectedTokenMetadata}
        >
          <TokenContent>
            <TokenDetailsButton onClick={handleOpenSelectTokenModal}>
              <TokenDetailsLogo />
              <TokenDetailsSymbol />
            </TokenDetailsButton>
            <TokenInput autoFocus />
          </TokenContent>
          <TokenData>
            <TokenDataBalances onMaxClick={handleMaxClick} />
            <TokenDataPrice />
          </TokenData>
          <TokenDataMetaInfo
            tokenSymbol={selectedTokenMetadata ? selectedTokenMetadata.symbol : ''}
            pageInfo="deposit"
            tokenValue={amount}></TokenDataMetaInfo>
          <Skeleton isLoaded={!isLoading} borderRadius="6" mt={'3'}>
            <Text mb="4" fontWeight={600}> To :</Text>
            <Input type="text" fontSize={'large'} placeholder="Enter Principal ID or Account ID" size="md"/>
          </Skeleton>
        </Token>
      </Box>
      <FeeBox isTransfer token={selectedTokenMetadata} />

      <Button isFullWidth size="lg" variant="gradient" colorScheme="dark-blue"
        isDisabled={buttonDisabled} onClick={handleDeposit} isLoading={isLoading}>
        {buttonMessage}
      </Button>
    </>
  )
};
