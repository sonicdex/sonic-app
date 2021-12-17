import { useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { TitleBox, TokenBox, Button } from '@/components';

import {
  FeatureState,
  NotificationType,
  useAppDispatch,
  useNotificationStore,
  useSwapStore,
  useWithdrawViewStore,
  withdrawViewActions,
} from '@/store';
import { useNavigate } from 'react-router';
import { useQuery } from '@/hooks/use-query';
import { sonicCircleSrc } from '@/assets';
import { formatAmount, getCurrencyString } from '@/utils/format';
import { debounce } from '@/utils/function';

export const AssetsWithdraw = () => {
  const query = useQuery();
  const { amount, tokenId } = useWithdrawViewStore();
  const { supportedTokenList, sonicBalances, supportedTokenListState } =
    useSwapStore();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const selectedTokenMetadata = useMemo(() => {
    return supportedTokenList?.find(({ id }) => id === tokenId);
  }, [supportedTokenList, tokenId]);

  const handleTokenSelect = (tokenId: string) => {
    dispatch(withdrawViewActions.setTokenId(tokenId));
  };

  const [buttonDisabled, buttonMessage] = useMemo<[boolean, string]>(() => {
    if (!selectedTokenMetadata?.id) return [true, 'Select the token'];

    const parsedFromValue = (amount && parseFloat(amount)) || 0;

    if (parsedFromValue <= 0)
      return [true, `No ${selectedTokenMetadata?.name} value selected`];

    if (sonicBalances && selectedTokenMetadata) {
      const parsedBalance = parseFloat(
        formatAmount(
          sonicBalances[selectedTokenMetadata.id],
          selectedTokenMetadata.decimals
        )
      );

      if (parsedFromValue > parsedBalance) {
        return [true, `Insufficient ${selectedTokenMetadata.name} Balance`];
      }
    }

    return [false, 'Withdraw'];
  }, [amount, sonicBalances, selectedTokenMetadata]);

  const tokenBalance = useMemo(() => {
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
      handleTokenSelect(tokenId);
    }

    return () => {
      dispatch(withdrawViewActions.setAmount('0.00'));
    };
  }, []);

  const handleWithdraw = () => {
    addNotification({
      title: `Withdrawing ${selectedTokenMetadata?.symbol}`,
      type: NotificationType.Withdraw,
      id: String(new Date().getTime()),
    });

    debounce(() => dispatch(withdrawViewActions.setAmount('0.00')), 300);
  };

  return (
    <>
      <TitleBox
        title="Withdraw Asset"
        onArrowBack={() => navigate('/assets')}
      />
      {supportedTokenListState === FeatureState.Loading &&
      !supportedTokenList ? (
        <Box my={5}>
          <TokenBox
            sources={[{ name: 'Sonic', src: sonicCircleSrc }]}
            isLoading
          />
        </Box>
      ) : selectedTokenMetadata && tokenId ? (
        <Box my={5}>
          <TokenBox
            value={amount}
            setValue={(value) => dispatch(withdrawViewActions.setAmount(value))}
            onTokenSelect={handleTokenSelect}
            selectedTokenIds={[tokenId]}
            status={buttonDisabled ? 'disabled' : 'active'}
            otherTokensMetadata={supportedTokenList}
            selectedTokenMetadata={selectedTokenMetadata}
            price={0}
            onMaxClick={() =>
              dispatch(
                withdrawViewActions.setAmount(
                  getCurrencyString(
                    tokenBalance,
                    selectedTokenMetadata.decimals
                  )
                )
              )
            }
            sources={[
              {
                name: 'Sonic',
                src: sonicCircleSrc,
                balance: tokenBalance,
              },
            ]}
          />
        </Box>
      ) : null}

      <Button
        isFullWidth
        size="lg"
        isDisabled={buttonDisabled}
        onClick={handleWithdraw}
        isLoading={supportedTokenListState === FeatureState.Loading}
      >
        {buttonMessage}
      </Button>
    </>
  );
};
