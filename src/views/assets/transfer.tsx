import { Box, Button, Skeleton, Input, Text } from '@chakra-ui/react';
import { toBigNumber } from '@sonicdex/sonic-js';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { FeeBox } from '@/components/core/fee-box';
import { useQuery } from '@/hooks/use-query';
import {
  Token, TokenContent, TokenData, TokenDataBalances, TokenDataPrice, TokenDetailsButton,
  TokenDetailsLogo, TokenDetailsSymbol, TokenDataMetaInfo, TokenInput, ViewHeader,
} from '@/components';


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
  const ICPTOKENID='ryjl3-tyaaa-aaaaa-aaaba-cai';
  const { amount, tokenId , toAddress ,addressType} = useTransferViewStore(); 
   
  const { addNotification } = useNotificationStore();
  const openSelectTokenModal = useTokenModalOpener();

  const selectedTokenMetadata = tokenId ? tokenList('obj')[tokenId] : tokenList('obj')[ICPTOKENID];

  const supportingAddrsType: string = useMemo(() => {
    if (selectedTokenMetadata?.id == ICPTOKENID) {
      return 'both';
    } else return 'principalId';
  }, [selectedTokenMetadata])

  const handleSelectTokenId = (tokenId?: string) => {
    if (tokenId) { dispatch(transferViewActions.setTokenId(tokenId)); }

  };

  const handleOpenSelectTokenModal = () => {
    openSelectTokenModal({ metadata: supportedTokenList, onSelect: (tokenId) => handleSelectTokenId(tokenId), selectedTokenIds: [] });
  };

  const handleTransfer = () => {
    addNotification({ title: `Transfer ${amount} ${selectedTokenMetadata?.symbol}`, type: NotificationType.Transfer, id: String(new Date().getTime()), });
    debounce(() => dispatch(transferViewActions.setAmount('')), 300);
  };

  const handleMaxClick = () => {
    if (tokenBalance && selectedTokenMetadata)
      dispatch(transferViewActions.setAmount(getMaxValue(selectedTokenMetadata, tokenBalance, true).toString()));
  };
  //const [toAddress, setToAddress] = useState('');

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (!isConnected) return [true, 'Connect wallet'];
    if (!selectedTokenMetadata?.id) return [true, 'Select a Token'];
    const parsedFromValue = (amount && parseFloat(amount)) || 0;
    if (parsedFromValue <= 0) return [true, `Enter ${selectedTokenMetadata?.symbol} Amount`];
    if (parsedFromValue <= toBigNumber(selectedTokenMetadata.fee).applyDecimals(selectedTokenMetadata.decimals).toNumber()) {
      return [true, `Amount must be greater than fee`];
    }

    if (tokenBalances && selectedTokenMetadata) {
      if (parsedFromValue > getMaxValue(selectedTokenMetadata, tokenBalances[selectedTokenMetadata.id], true).toNumber()) {
        return [true, `Insufficient ${selectedTokenMetadata.symbol} Balance`];
      }
    }
   // const addressType = checkAddressType(toAddress);
    if (supportingAddrsType == 'both') {
      if (addressType == 'none') {
        return [true, 'Invalid Address'];
      }
    } else {
      if (supportingAddrsType != addressType) {
        return [true, 'Invalid Address'];
      }
    }
    return [false, `Send ${amount} ${selectedTokenMetadata.symbol} `];
  }, [amount, toAddress, tokenBalances, selectedTokenMetadata,addressType]);

  const tokenBalance = useMemo(() => {
    if (tokenBalances && tokenId) return tokenBalances[tokenId];
    return 0;
  }, [tokenBalances, tokenId ]);

  const isLoading = useMemo(() =>
    supportedTokenListState === FeatureState.Loading ||
    balancesState === FeatureState.Loading,
    [supportedTokenListState, balancesState]
  );

  useEffect(() => {
    const tokenId = query.get('tokenId');
    if (tokenId) handleSelectTokenId(tokenId);
    return () => { dispatch(transferViewActions.setAmount('')); };
  }, []);

  const connectedWalletInfo = artemis.connectedWalletInfo;

  const handleToAddressChange = (event: any) => {
    dispatch(transferViewActions.setToAddress(event?.target?.value))
  };

  return (
    <>
      <ViewHeader title={"Transfer " + selectedTokenMetadata?.symbol + ''} onArrowBack={() => navigate('/assets')} />
      <Box my={5}>
        <Token isLoading={isLoading} value={amount}
          setValue={(value) => dispatch(transferViewActions.setAmount(value))}
          sources={[{ name: connectedWalletInfo?.name, src: connectedWalletInfo?.icon, balance: tokenBalance }]}
          tokenListMetadata={supportedTokenList} tokenMetadata={selectedTokenMetadata}
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
            <Input type="text" value={toAddress} onChange={handleToAddressChange} fontSize={'large'}
              placeholder={`Enter ${supportingAddrsType === 'both' ? 'Principal ID or Account ID' : supportingAddrsType === 'accountId' ? 'Account ID' : supportingAddrsType === 'principalId' ? 'Principal ID' : ''}`}
              size="md" />
          </Skeleton>
        </Token>
      </Box>
      <FeeBox isTransfer token={selectedTokenMetadata} />

      <Button isFullWidth size="lg" variant="gradient" colorScheme="dark-blue"
        isDisabled={buttonDisabled} onClick={handleTransfer} isLoading={isLoading}>
        {buttonMessage}
      </Button>
    </>
  )
};
