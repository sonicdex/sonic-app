import { Box, Button } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { plugCircleSrc } from '@/assets';
import {
  Token,
  TokenBalances,
  TokenBalancesDetails,
  TokenBalancesPrice,
  TokenContent,
  TokenDetailsButton,
  TokenDetailsLogo,
  TokenDetailsSymbol,
  TokenInput,
  ViewHeader,
} from '@/components';
import { FeeBox } from '@/components/core/fee-box';
import { useQuery } from '@/hooks/use-query';
import {
  depositViewActions,
  FeatureState,
  NotificationType,
  useAppDispatch,
  useDepositViewStore,
  useNotificationStore,
  useSwapCanisterStore,
  useTokenModalOpener,
} from '@/store';
import { formatAmount, getCurrency, getCurrencyString } from '@/utils/format';
import { debounce } from '@/utils/function';

export const AssetsDepositView = () => {
  const query = useQuery();

  const { supportedTokenList, tokenBalances, supportedTokenListState } =
    useSwapCanisterStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { amount, tokenId } = useDepositViewStore();
  const { addNotification } = useNotificationStore();
  const openSelectTokenModal = useTokenModalOpener();

  const selectedTokenMetadata = useMemo(() => {
    if (tokenId && supportedTokenList) {
      return supportedTokenList.find(({ id }) => id === tokenId);
    }
    return undefined;
  }, [supportedTokenList, tokenId]);

  const handleSelectTokenId = (tokenId?: string) => {
    if (tokenId) {
      dispatch(depositViewActions.setTokenId(tokenId));
    }
  };

  const handleOpenSelectTokenModal = () => {
    openSelectTokenModal({
      metadata: supportedTokenList,
      onSelect: (tokenId) => handleSelectTokenId(tokenId),
      selectedTokenIds: [],
    });
  };

  const handleDeposit = () => {
    addNotification({
      title: `Depositing ${selectedTokenMetadata?.symbol}`,
      type: NotificationType.Deposit,
      id: String(new Date().getTime()),
    });
    debounce(() => dispatch(depositViewActions.setAmount('')), 300);
  };

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (!selectedTokenMetadata?.id) return [true, 'Select a Token'];

    const parsedFromValue = (amount && parseFloat(amount)) || 0;

    if (parsedFromValue <= 0)
      return [true, `Enter ${selectedTokenMetadata?.symbol} Amount`];

    if (
      parsedFromValue <=
      getCurrency(selectedTokenMetadata.fee, selectedTokenMetadata.decimals)
    ) {
      return [true, `Amount must be greater than fee`];
    }

    if (tokenBalances && selectedTokenMetadata) {
      const parsedBalance = parseFloat(
        formatAmount(
          tokenBalances[selectedTokenMetadata.id],
          selectedTokenMetadata.decimals
        )
      );

      if (parsedFromValue > parsedBalance) {
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

  const handleMaxClick = () => {
    if (tokenBalance && selectedTokenMetadata)
      dispatch(
        depositViewActions.setAmount(
          getCurrencyString(
            tokenBalance - Number(selectedTokenMetadata.fee),
            selectedTokenMetadata.decimals
          )
        )
      );
  };

  const isLoading = useMemo(
    () => supportedTokenListState === FeatureState.Loading,
    [supportedTokenListState]
  );

  return (
    <>
      <ViewHeader
        title="Deposit Asset"
        onArrowBack={() => navigate('/assets')}
      />
      <Box my={5}>
        <Token
          isLoading={isLoading}
          value={amount}
          setValue={(value) => dispatch(depositViewActions.setAmount(value))}
          sources={[
            {
              name: 'Plug Wallet',
              src: plugCircleSrc,
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
          <TokenBalances>
            <TokenBalancesDetails onMaxClick={handleMaxClick} />
            <TokenBalancesPrice />
          </TokenBalances>
        </Token>
      </Box>
      <FeeBox token={selectedTokenMetadata} isDeposit />
      <Button
        isFullWidth
        size="lg"
        variant="gradient"
        colorScheme="dark-blue"
        isDisabled={buttonDisabled}
        onClick={handleDeposit}
        isLoading={supportedTokenListState === FeatureState.Loading}
      >
        {buttonMessage}
      </Button>
    </>
  );
};
