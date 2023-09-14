import { Box, Button } from '@chakra-ui/react';
import { toBigNumber } from '@sonicdex/sonic-js';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { 
  Token, TokenContent, TokenData, TokenDataBalances,TokenDataPrice,TokenDetailsButton,
  TokenDetailsLogo,TokenDetailsSymbol,TokenDataMetaInfo,TokenInput,ViewHeader,
} from '@/components';

import { FeeBox } from '@/components/core/fee-box';

import { useQuery } from '@/hooks/use-query';

import { useTokenAllowance } from '@/hooks/use-token-allowance';
import {
  depositViewActions, FeatureState, NotificationType, useAppDispatch, useDepositViewStore,
  useNotificationStore, useSwapCanisterStore, useTokenModalOpener, useWalletStore
} from '@/store';

import { getMaxValue } from '@/utils/format';
import { debounce } from '@/utils/function';

import {tokenList } from '@/utils';

import {artemis} from '@/integrations/artemis';


export const AssetsDepositView = () => {
  const query = useQuery();
  const { supportedTokenList, tokenBalances, balancesState, supportedTokenListState } = useSwapCanisterStore();

  const {isConnected} = useWalletStore()

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { amount, tokenId } = useDepositViewStore();

  const { addNotification } = useNotificationStore();
  const openSelectTokenModal = useTokenModalOpener();

  const selectedTokenMetadata =  tokenList('obj')[tokenId?tokenId:''];

  const allowance = useTokenAllowance(selectedTokenMetadata?.id)
  
  const handleSelectTokenId = (tokenId?: string) => {
    if (tokenId) {
      dispatch(depositViewActions.setTokenId(tokenId));
    }
  };

  const handleOpenSelectTokenModal = () => {
    openSelectTokenModal({ metadata: supportedTokenList, onSelect: (tokenId) => handleSelectTokenId(tokenId), selectedTokenIds: []});
  };

  const handleDeposit = () => {
    addNotification({
      title: `Deposit ${amount} ${selectedTokenMetadata?.symbol}`,
      type: NotificationType.Deposit,
      id: String(new Date().getTime()),
    });
    debounce(() => dispatch(depositViewActions.setAmount('')), 300);
  };

  const handleMaxClick = () => {
    if (tokenBalance && selectedTokenMetadata)
      dispatch(
        depositViewActions.setAmount(
          getMaxValue(selectedTokenMetadata, tokenBalance).toString()
        )
      );
  };

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if(!isConnected) return [true, 'Connect wallet'];
    if (!selectedTokenMetadata?.id) return [true, 'Select a Token'];

    if (typeof allowance !== 'number') return [true, 'Getting allowance...'];

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
        getMaxValue( selectedTokenMetadata,tokenBalances[selectedTokenMetadata.id]).toNumber()
      ) {
        return [true, `Insufficient ${selectedTokenMetadata.symbol} Balance`];
      }
    }

    return [false, 'Deposit'];
  }, [amount, tokenBalances, selectedTokenMetadata, allowance]);

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
      dispatch(depositViewActions.setAmount(fromQueryValue));
    }

    if (tokenId) {
      handleSelectTokenId(tokenId);
    }

    return () => {
      dispatch(depositViewActions.setAmount(''));
    };
  }, []);

  var connectedWalletInfo = artemis.connectedWalletInfo;
  
  return (
    <>
      <ViewHeader title={ "Deposit "+ selectedTokenMetadata?.symbol + '' } onArrowBack={() => navigate('/assets')}/>
      <Box my={5}>
        <Token
          isLoading={isLoading}
          value={amount}
          setValue={(value) => dispatch(depositViewActions.setAmount(value))}
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
                tokenSymbol={selectedTokenMetadata?selectedTokenMetadata.symbol:''}
                pageInfo="deposit"
                tokenValue={amount}></TokenDataMetaInfo>
        </Token>
      </Box>
      <FeeBox token={selectedTokenMetadata} isDeposit />
      
      <Button  isFullWidth  size="lg"  variant="gradient" colorScheme="dark-blue" 
      isDisabled={buttonDisabled} onClick={handleDeposit} isLoading={isLoading}>
        {buttonMessage}
      </Button>
    </>
  )
};
