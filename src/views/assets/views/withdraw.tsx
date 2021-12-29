import { useEffect, useMemo } from 'react';
import { Button, Box } from '@chakra-ui/react';
import {
  TitleBox,
  Token,
  TokenContent,
  TokenDetailsButton,
  TokenDetailsLogo,
  TokenDetailsSymbol,
  TokenBalancesDetails,
  TokenBalancesPrice,
  TokenBalances,
  TokenInput,
} from '@/components';

import {
  FeatureState,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapCanisterStore,
  useTokenModalOpener,
  useWithdrawViewStore,
  withdrawViewActions,
} from '@/store';
import { useNavigate } from 'react-router';
import { useQuery } from '@/hooks/use-query';
import { sonicCircleSrc } from '@/assets';
import { formatAmount, getCurrency, getCurrencyString } from '@/utils/format';
import { debounce } from '@/utils/function';
import { FeeBox } from '@/components/core/fee-box';

export const AssetsWithdraw = () => {
  const query = useQuery();
  const { amount, tokenId } = useWithdrawViewStore();
  const {
    supportedTokenList,
    icpBalance,
    sonicBalances,
    supportedTokenListState,
  } = useSwapCanisterStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const openSelectTokenModal = useTokenModalOpener();

  const selectedTokenMetadata = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList, tokenId]);

  const handleSelectTokenId = (tokenId?: string) => {
    dispatch(withdrawViewActions.setTokenId(tokenId!));
  };

  const handleOpenSelectTokenModal = () => {
    openSelectTokenModal({
      metadata: supportedTokenList,
      onSelect: (tokenId) => handleSelectTokenId(tokenId),
      selectedTokenIds: [],
    });
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

    if (sonicBalances && selectedTokenMetadata) {
      const parsedBalance = parseFloat(
        formatAmount(
          sonicBalances[selectedTokenMetadata.id],
          selectedTokenMetadata.decimals
        )
      );

      if (parsedFromValue > parsedBalance) {
        return [true, `Insufficient ${selectedTokenMetadata.symbol} Balance`];
      }
    }

    return [false, 'Withdraw'];
  }, [amount, sonicBalances, selectedTokenMetadata]);

  const tokenBalance = useMemo(() => {
    if (tokenId === 'ICP') {
      return icpBalance;
    }

    if (sonicBalances && tokenId) {
      return sonicBalances[tokenId];
    }

    return 0;
  }, [sonicBalances, tokenId]);

  useEffect(() => {
    const tokenId = query.get('tokenId');
    const amount = query.get('amount');

    if (amount) {
      dispatch(withdrawViewActions.setAmount(amount));
    }

    if (tokenId) {
      handleSelectTokenId(tokenId);
    }

    return () => {
      dispatch(withdrawViewActions.setAmount(''));
    };
  }, []);

  const handleWithdraw = () => {
    addNotification({
      title: `Withdrawing ${selectedTokenMetadata?.symbol}`,
      type: NotificationType.Withdraw,
      id: String(new Date().getTime()),
    });

    debounce(() => dispatch(withdrawViewActions.setAmount('')), 300);
  };

  const handleMaxClick = () => {
    dispatch(
      withdrawViewActions.setAmount(
        getCurrencyString(tokenBalance, selectedTokenMetadata?.decimals)
      )
    );
  };

  const isLoading =
    supportedTokenListState === FeatureState.Loading &&
    !supportedTokenList &&
    !selectedTokenMetadata &&
    !tokenId;

  return (
    <>
      <TitleBox
        title="Withdraw Asset"
        onArrowBack={() => navigate('/assets')}
      />
      <Box my={5}>
        <Token
          value={amount}
          setValue={(value) => dispatch(withdrawViewActions.setAmount(value))}
          tokenListMetadata={supportedTokenList}
          tokenMetadata={selectedTokenMetadata}
          price={0}
          isLoading={isLoading}
          sources={[
            {
              name: 'Sonic',
              src: sonicCircleSrc,
              balance: tokenBalance,
            },
          ]}
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
      <FeeBox token={selectedTokenMetadata} />
      <Button
        isFullWidth
        variant="gradient"
        colorScheme="dark-blue"
        size="lg"
        onClick={handleWithdraw}
        isLoading={isLoading}
        isDisabled={buttonDisabled}
      >
        {buttonMessage}
      </Button>
    </>
  );
};
