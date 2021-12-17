import { useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import {
  depositViewActions,
  FeatureState,
  NotificationType,
  useAppDispatch,
  useDepositViewStore,
  useNotificationStore,
  useSwapStore,
} from '@/store';
import { useNavigate } from 'react-router';
import { useQuery } from '@/hooks/use-query';
import { plugCircleSrc } from '@/assets';
import { formatAmount, getCurrencyString } from '@/utils/format';
import { debounce } from '@/utils/function';

export const AssetsDeposit = () => {
  const query = useQuery();

  const { supportedTokenList, tokenBalances, supportedTokenListState } =
    useSwapStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { amount, tokenId } = useDepositViewStore();
  const { addNotification } = useNotificationStore();

  const selectedTokenMetadata = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList, tokenId]);

  const handleTokenSelect = (tokenId: string) => {
    dispatch(depositViewActions.setTokenId(tokenId));
  };

  const handleDeposit = () => {
    addNotification({
      title: `Depositing ${selectedTokenMetadata?.symbol}`,
      type: NotificationType.Deposit,
      id: String(new Date().getTime()),
    });
    debounce(() => dispatch(depositViewActions.setAmount('0.00')), 300);
  };

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (!selectedTokenMetadata?.id) return [true, 'Select the token'];

    const parsedFromValue = (amount && parseFloat(amount)) || 0;

    if (parsedFromValue <= 0)
      return [true, `No ${selectedTokenMetadata?.name} value selected`];

    if (tokenBalances && selectedTokenMetadata) {
      const parsedBalance = parseFloat(
        formatAmount(
          tokenBalances[selectedTokenMetadata.id],
          selectedTokenMetadata.decimals
        )
      );

      if (parsedFromValue > parsedBalance) {
        return [true, `Insufficient ${selectedTokenMetadata.name} Balance`];
      }
    }

    return [false, 'Withdraw'];
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
      handleTokenSelect(tokenId);
    }

    return () => {
      dispatch(depositViewActions.setAmount('0.00'));
    };
  }, []);

  return (
    <>
      <TitleBox title="Deposit Asset" onArrowBack={() => navigate('/assets')} />
      {supportedTokenListState === FeatureState.Loading &&
      !supportedTokenList ? (
        <Box my={5}>
          <TokenBox
            sources={[{ name: 'Plug Wallet', src: plugCircleSrc }]}
            isLoading
          />
        </Box>
      ) : selectedTokenMetadata && tokenId ? (
        <Box my={5}>
          <TokenBox
            value={amount}
            onMaxClick={() =>
              dispatch(
                depositViewActions.setAmount(
                  getCurrencyString(
                    tokenBalance,
                    selectedTokenMetadata.decimals
                  )
                )
              )
            }
            setValue={(value) => dispatch(depositViewActions.setAmount(value))}
            onTokenSelect={handleTokenSelect}
            price={0}
            sources={[
              {
                name: 'Plug Wallet',
                src: plugCircleSrc,
                balance: tokenBalance,
              },
            ]}
            selectedTokenIds={[tokenId as string]}
            status={buttonDisabled ? 'disabled' : 'active'}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={selectedTokenMetadata}
          />
        </Box>
      ) : null}
      <Button
        isFullWidth
        size="lg"
        isDisabled={buttonDisabled}
        onClick={handleDeposit}
        isLoading={supportedTokenListState === FeatureState.Loading}
      >
        {buttonMessage}
      </Button>
    </>
  );
};
