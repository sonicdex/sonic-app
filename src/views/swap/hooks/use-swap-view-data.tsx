import { Link } from '@chakra-ui/react';
import { Pair, Swap, toBigNumber } from '@psychedelic/sonic-js';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { batch } from 'react-redux';

import { PLUG_WALLET_WEBSITE_URL } from '@/components';
import { ENV } from '@/config';
import { getAppAssetsSources } from '@/config/utils';
import { ICP_METADATA } from '@/constants';
import {
  useBalances,
  useQuery,
  useTokenBalanceMemo,
  useTokenSelectionChecker,
} from '@/hooks';
import { plug } from '@/integrations/plug';
import {
  FeatureState,
  INITIAL_SWAP_SLIPPAGE,
  NotificationType,
  SwapTokenDataKey,
  swapViewActions,
  useAppDispatch,
  useCyclesMintingCanisterStore,
  useNotificationStore,
  usePlugStore,
  usePriceStore,
  useSwapCanisterStore,
  useSwapViewStore,
  useTokenModalOpener,
} from '@/store';
import { formatValue, getMaxValue } from '@/utils/format';
import { debounce } from '@/utils/function';

import { OperationType } from '../components';
import {
  getAmountOutFromPath,
  getICPValueByXDRRate,
  getXTCValueByXDRRate,
} from '../swap.utils';

export enum SwapStep {
  Home,
  Review,
}

export const useSwapViewData = () => {
  const [lastChangedInputDataKey, setLastChangedInputDataKey] =
    useState<SwapTokenDataKey>('from');

  const [step, setStep] = useState(SwapStep.Home);
  const [isAutoSlippage, setIsAutoSlippage] = useState(true);

  const query = useQuery();
  const { addNotification } = useNotificationStore();
  const { fromTokenOptions, toTokenOptions, from, to, tokenList, keepInSonic } =
    useSwapViewStore();
  const dispatch = useAppDispatch();
  const {
    sonicBalances,
    tokenBalances,
    icpBalance,
    balancesState,
    supportedTokenListState,
    supportedTokenList,
    allPairsState,
    allPairs,
  } = useSwapCanisterStore();
  const { totalBalances } = useBalances();

  const { ICPXDRconversionRate } = useCyclesMintingCanisterStore();
  const { state: priceState } = usePriceStore();
  const { isConnected } = usePlugStore();

  const openSelectTokenModal = useTokenModalOpener();

  const {
    isFirstIsSelected: isFromTokenIsICP,
    isSecondIsSelected: isToTokenIsICP,
    isTokenSelected: isICPSelected,
  } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
  });

  const {
    isTokenSelected: isWICPSelected,
    isFirstIsSelected: isFromTokenIsWICP,
    isSecondIsSelected: isToTokenIsWICP,
  } = useTokenSelectionChecker({
    id0: from.metadata?.id,
    id1: to.metadata?.id,
    targetId: ENV.canistersPrincipalIDs.WICP,
  });

  const { isSecondIsSelected: isToTokenIsXTC, isTokenSelected: isXTCSelected } =
    useTokenSelectionChecker({
      id0: from.metadata?.id,
      id1: to.metadata?.id,
      targetId: ENV.canistersPrincipalIDs.XTC,
    });

  const fromBalance = useTokenBalanceMemo(from.metadata?.id);
  const toBalance = useTokenBalanceMemo(to.metadata?.id);

  function handleICPToWICPChange(newValue: string, dataKey: SwapTokenDataKey) {
    const oppositeDataKey = dataKey === 'from' ? 'to' : 'from';

    const _newValue = new BigNumber(newValue);
    const icpFee = formatValue(ICP_METADATA.fee, ICP_METADATA.decimals);

    const value =
      dataKey === 'from' ? _newValue.minus(icpFee) : _newValue.plus(icpFee);

    dispatch(
      swapViewActions.setValue({
        data: oppositeDataKey,
        value:
          value.toNumber() > 0
            ? value.dp(ICP_METADATA.decimals).toString()
            : '',
      })
    );
  }

  function handleICPToXTCChange(newValue: string, dataKey: SwapTokenDataKey) {
    const oppositeDataKey = dataKey === 'from' ? 'to' : 'from';

    const xtcMetadata = tokenList?.[ENV.canistersPrincipalIDs.XTC];

    if (ICPXDRconversionRate && xtcMetadata) {
      const handler =
        dataKey === 'from' ? getXTCValueByXDRRate : getICPValueByXDRRate;

      const xtcFee = new BigNumber(
        formatValue(xtcMetadata.fee, xtcMetadata.decimals)
      );

      const icpFeesConvertedToXTC = getXTCValueByXDRRate({
        amount: formatValue(ICP_METADATA.fee, ICP_METADATA.decimals),
        conversionRate: ICPXDRconversionRate,
      })
        .minus(xtcFee)
        .multipliedBy(2);

      const xtcFees = xtcFee.multipliedBy(keepInSonic ? 4 : 2);

      const amount =
        dataKey === 'from'
          ? newValue
          : new BigNumber(newValue)
              .plus(xtcFees)
              .plus(icpFeesConvertedToXTC)
              .toString();

      const rateBasedAmount = handler({
        amount,
        conversionRate: ICPXDRconversionRate,
      });

      const resultAmount =
        dataKey === 'from'
          ? rateBasedAmount.minus(icpFeesConvertedToXTC).minus(xtcFees)
          : rateBasedAmount.dp(ICP_METADATA.decimals);

      dispatch(
        swapViewActions.setValue({
          data: oppositeDataKey,
          value: resultAmount.toNumber() > 0 ? resultAmount.toString() : '',
        })
      );
    }
  }

  function handleICPToTokenChange(newValue: string, dataKey: SwapTokenDataKey) {
    const oppositeDataKey = dataKey === 'from' ? 'to' : 'from';
    const data = dataKey === 'from' ? from : to;
    const oppositeData = dataKey === 'from' ? to : from;

    const wrappedICPMetadata = supportedTokenList?.find(
      (token) => token.id === ENV.canistersPrincipalIDs.WICP
    );

    if (wrappedICPMetadata && tokenList && allPairs) {
      const paths = Swap.getTokenPaths({
        pairList: allPairs as unknown as Pair.List,
        tokenList,
        tokenId: wrappedICPMetadata.id,
        amount: newValue,
      });

      const dataWICP = {
        ...data,
        metadata: wrappedICPMetadata,
        paths,
      };

      dispatch(
        swapViewActions.setValue({
          data: oppositeDataKey,
          value: getAmountOutFromPath(dataWICP, oppositeData),
        })
      );
    }
  }

  const handleSetValue = (value: string, dataKey: SwapTokenDataKey) => {
    dispatch(swapViewActions.setValue({ data: dataKey, value }));
  };

  const resetViewState = useCallback(() => {
    setStep(SwapStep.Home);
    dispatch(
      swapViewActions.setValue({
        data: 'from',
        value: '',
      })
    );
    dispatch(
      swapViewActions.setValue({
        data: 'to',
        value: '',
      })
    );
  }, [dispatch]);

  const resetStepToHome = useCallback(() => {
    if (step === SwapStep.Review) {
      setStep(SwapStep.Home);
    }
  }, [step]);

  const handleChangeValue = (value: string, dataKey: SwapTokenDataKey) => {
    if (!from.metadata || !allPairs) return;
    resetStepToHome();
    handleSetValue(value, dataKey);

    if (isICPSelected && isWICPSelected) {
      handleICPToWICPChange(value, dataKey);
      return;
    }

    if (isICPSelected && isXTCSelected) {
      handleICPToXTCChange(value, dataKey);
      return;
    }

    if (isICPSelected) {
      handleICPToTokenChange(value, dataKey);
      return;
    }
  };

  const handleSwitchTokens = () => {
    resetStepToHome();

    if (!to.metadata || (isFromTokenIsICP && isToTokenIsXTC)) {
      dispatch(swapViewActions.switchTokens(lastChangedInputDataKey));
      dispatch(swapViewActions.setToken({ data: 'to', tokenId: '' }));
    } else {
      dispatch(swapViewActions.switchTokens(lastChangedInputDataKey));
      setLastChangedInputDataKey(
        lastChangedInputDataKey === 'from' ? 'to' : 'from'
      );
    }
  };

  const handleMaxClick = (dataKey: SwapTokenDataKey) => {
    const balance = dataKey === 'from' ? fromBalance : toBalance;
    const metadata = dataKey === 'from' ? from.metadata : to.metadata;

    if (!balance) {
      return;
    }

    const maxValue = getMaxValue(metadata, balance).toString();

    handleChangeValue(maxValue, dataKey);
  };

  const handleSelectToken = (dataKey: SwapTokenDataKey) => {
    resetStepToHome();

    const options = dataKey === 'from' ? fromTokenOptions : toTokenOptions;
    const oppositeDataKey = dataKey === 'from' ? 'to' : 'from';
    const oppositeTokenId =
      dataKey === 'from' ? to.metadata?.id : from.metadata?.id;

    openSelectTokenModal({
      metadata: options,
      onSelect: (tokenId) => {
        batch(() => {
          if (
            (dataKey === 'from' && from?.metadata?.id === tokenId) ||
            (dataKey === 'to' && to?.metadata?.id === tokenId)
          ) {
            return;
          }

          if (oppositeTokenId === tokenId) {
            dispatch(
              swapViewActions.setToken({
                data: oppositeDataKey,
                tokenId: undefined,
              })
            );
            dispatch(swapViewActions.setToken({ data: dataKey, tokenId }));
          } else if (
            tokenId === ENV.canistersPrincipalIDs.XTC &&
            to.metadata?.id === ICP_METADATA.id
          ) {
            dispatch(swapViewActions.setToken({ data: dataKey, tokenId }));
            dispatch(
              swapViewActions.setToken({ data: oppositeDataKey, tokenId: '' })
            );
          } else {
            dispatch(swapViewActions.setToken({ data: dataKey, tokenId }));
          }
        });
      },
      selectedTokenIds,
    });
  };

  const checkIsPlugProviderVersionCompatible = useCallback(() => {
    const plugProviderVersionNumber = Number(
      plug?.versions.provider.split('.').join('')
    );

    const plugInpageProviderVersionWithChainedBatchTranscations = 160;

    if (
      plugProviderVersionNumber >=
      plugInpageProviderVersionWithChainedBatchTranscations
    ) {
      return true;
    } else {
      addNotification({
        title: (
          <>
            You're using an outdated version of Plug, please update to the
            latest one{' '}
            <Link
              color="blue.400"
              href={PLUG_WALLET_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
            .
          </>
        ),
        type: NotificationType.Error,
        id: String(new Date().getTime()),
      });
      return false;
    }
  }, [addNotification]);

  const handleMintXTC = useCallback(() => {
    if (checkIsPlugProviderVersionCompatible()) {
      addNotification({
        title: `Minting ${to.value} ${to.metadata?.symbol}`,
        type: NotificationType.MintXTC,
        id: String(new Date().getTime()),
      });
      debounce(resetViewState, 300);
    }
  }, [
    addNotification,
    checkIsPlugProviderVersionCompatible,
    resetViewState,
    to.metadata?.symbol,
    to.value,
  ]);

  const handleMintWICP = useCallback(() => {
    if (checkIsPlugProviderVersionCompatible()) {
      addNotification({
        title: `Wrapping ${from.value} ${from.metadata?.symbol}`,
        type: NotificationType.MintWICP,
        id: String(new Date().getTime()),
      });
      debounce(resetViewState, 300);
    }
  }, [
    addNotification,
    checkIsPlugProviderVersionCompatible,
    from.metadata?.symbol,
    from.value,
    resetViewState,
  ]);

  const handleWithdrawWICP = useCallback(() => {
    addNotification({
      title: `Unwrapping ${from.value} ${from.metadata?.symbol}`,
      type: NotificationType.WithdrawWICP,
      id: String(new Date().getTime()),
    });
    debounce(resetViewState, 300);
  }, [addNotification, from.metadata?.symbol, from.value, resetViewState]);

  const handleApproveSwap = useCallback(() => {
    addNotification({
      title: `Swap ${from.value} ${from.metadata?.symbol} for ${to.value} ${to.metadata?.symbol}`,
      type: NotificationType.Swap,
      id: String(new Date().getTime()),
    });
    debounce(resetViewState, 300);
  }, [
    addNotification,
    from.metadata?.symbol,
    from.value,
    resetViewState,
    to.metadata?.symbol,
    to.value,
  ]);

  const handleSetIsAutoSlippage = (isAutoSlippage: boolean) => {
    setIsAutoSlippage(isAutoSlippage);
  };

  const handleMenuClose = () => {
    if (isAutoSlippage) {
      dispatch(swapViewActions.setSlippage(INITIAL_SWAP_SLIPPAGE));
    }
  };

  const handleSetSlippage = (slippage: string) => {
    dispatch(swapViewActions.setSlippage(slippage));
  };

  const isFetchingNotStarted = useMemo(
    () =>
      allPairsState === FeatureState.NotStarted ||
      supportedTokenListState === FeatureState.NotStarted,
    [supportedTokenListState, allPairsState]
  );

  const isLoading = useMemo(
    () =>
      balancesState === FeatureState.Loading ||
      supportedTokenListState === FeatureState.Loading ||
      allPairsState === FeatureState.Loading,
    [balancesState, supportedTokenListState, allPairsState]
  );

  const isBalancesUpdating = useMemo(
    () => balancesState === FeatureState.Updating,
    [balancesState]
  );
  const isPriceUpdating = useMemo(
    () => priceState === FeatureState.Updating,
    [priceState]
  );

  const [isButtonDisabled, buttonMessage, handleButtonClick] = useMemo<
    [boolean, string, (() => void)?]
  >(() => {
    if (isLoading) return [true, 'Loading'];
    if (isFetchingNotStarted || !from.metadata) return [true, 'Fetching'];
    if (!to.metadata) return [true, 'Select a Token'];

    if (toTokenOptions && toTokenOptions.length <= 0)
      return [true, 'No pairs available'];

    const parsedFromValue = (from.value && parseFloat(from.value)) || 0;

    if (parsedFromValue <= 0)
      return [true, `Enter ${from.metadata.symbol} Amount`];

    if (
      parsedFromValue <=
      toBigNumber(from.metadata.fee)
        .applyDecimals(from.metadata.decimals)
        .toNumber()
    ) {
      return [true, `${from.metadata.symbol} amount must be greater than fee`];
    }

    const parsedToValue = (to.value && parseFloat(to.value)) || 0;

    if (
      parsedToValue <=
      toBigNumber(to.metadata.fee)
        .applyDecimals(to.metadata.decimals)
        .toNumber()
    ) {
      return [true, `${to.metadata.symbol} amount must be greater than fee`];
    }

    if (totalBalances && typeof fromBalance === 'number') {
      if (parsedFromValue > Number(getMaxValue(from.metadata, fromBalance))) {
        return [true, `Insufficient ${from.metadata.symbol} Balance`];
      }
    }

    if (isFromTokenIsICP && isToTokenIsWICP) {
      return [false, 'Wrap', handleMintWICP];
    }

    if (isFromTokenIsWICP && isToTokenIsICP) {
      return [false, 'Unwrap', handleWithdrawWICP];
    }

    if (isFromTokenIsICP && isToTokenIsXTC) {
      return [false, 'Mint XTC', handleMintXTC];
    }

    const handleButtonClick = () => {
      if (step !== SwapStep.Review) {
        setStep(SwapStep.Review);
      }

      if (step === SwapStep.Review) {
        handleApproveSwap();
      }
    };

    const buttonText = step === SwapStep.Review ? 'Swap' : 'Review Swap';

    return [false, buttonText, handleButtonClick];
  }, [
    isLoading,
    isFetchingNotStarted,
    from.metadata,
    from.value,
    to.metadata,
    to.value,
    toTokenOptions,
    totalBalances,
    fromBalance,
    isFromTokenIsICP,
    isToTokenIsWICP,
    isFromTokenIsWICP,
    isToTokenIsICP,
    isToTokenIsXTC,
    handleMintWICP,
    handleWithdrawWICP,
    handleMintXTC,
    step,
    handleApproveSwap,
  ]);

  const headerTitle = useMemo(() => {
    if (isFromTokenIsICP && isToTokenIsXTC) {
      return 'Mint XTC';
    }

    if (isFromTokenIsICP && isToTokenIsWICP) {
      return 'Wrap';
    }

    if (isFromTokenIsWICP && isToTokenIsICP) {
      return 'Unwrap';
    }

    return 'Swap';
  }, [
    isFromTokenIsICP,
    isToTokenIsXTC,
    isToTokenIsWICP,
    isFromTokenIsWICP,
    isToTokenIsICP,
  ]);

  const priceImpact = useMemo(
    () =>
      Swap.getPriceImpact({
        amountIn: from.value,
        amountOut: to.value,
        priceIn: from.metadata?.price ?? '0',
        priceOut: to.metadata?.price ?? '0',
      }).toString(),
    [from, to]
  );

  const selectedTokenIds = useMemo(() => {
    const selectedIds = [];
    if (from?.metadata?.id) {
      selectedIds.push(from.metadata.id);
    }

    return selectedIds;
  }, [from?.metadata?.id]);

  const [isSelectTokenButtonDisabled, selectTokenButtonText] = useMemo(() => {
    if (toTokenOptions && toTokenOptions.length <= 0)
      return [true, 'No pairs available'];
    return [false, 'Select a Token'];
  }, [toTokenOptions]);

  const fromSources = useMemo(() => {
    if (from.metadata) {
      if (from.metadata.id === ICP_METADATA.id) {
        return getAppAssetsSources({
          balances: {
            plug: icpBalance ?? 0,
          },
        });
      }

      return getAppAssetsSources({
        balances: {
          plug: tokenBalances ? tokenBalances[from.metadata.id] : 0,
          sonic: sonicBalances ? sonicBalances[from.metadata.id] : 0,
        },
      });
    }
  }, [from.metadata, tokenBalances, sonicBalances, icpBalance]);

  const toSources = useMemo(() => {
    if (to.metadata) {
      if (to.metadata.id === ICP_METADATA.id) {
        return getAppAssetsSources({
          balances: {
            plug: icpBalance ?? 0,
          },
        });
      }

      return getAppAssetsSources({
        balances: {
          plug: tokenBalances ? tokenBalances[to.metadata.id] : 0,
          sonic: sonicBalances ? sonicBalances[to.metadata.id] : 0,
        },
      });
    }
  }, [to.metadata, tokenBalances, sonicBalances, icpBalance]);

  const isExplanationTooltipVisible = useMemo(() => {
    return isToTokenIsXTC && isFromTokenIsICP;
  }, [isFromTokenIsICP, isToTokenIsXTC]);

  const currentOperation = useMemo(
    () =>
      isFromTokenIsICP && isToTokenIsWICP
        ? OperationType.Wrap
        : isFromTokenIsICP && isToTokenIsXTC
        ? OperationType.Mint
        : OperationType.Swap,
    [isFromTokenIsICP, isToTokenIsWICP, isToTokenIsXTC]
  );

  const canHeldInSonic = useMemo(() => !isToTokenIsICP, [isToTokenIsICP]);

  useEffect(() => {
    // Get tokens from query params after loading
    if (!isLoading && fromTokenOptions && toTokenOptions) {
      const tokenFromId = query.get('from');
      const tokenToId = query.get('to');

      if (tokenFromId) {
        const from = fromTokenOptions.find(({ id }) => id === tokenFromId);
        if (from?.id) {
          dispatch(
            swapViewActions.setToken({ data: 'from', tokenId: from.id })
          );
          dispatch(swapViewActions.setValue({ data: 'from', value: '' }));
        }
      }

      if (tokenToId) {
        const to = toTokenOptions.find(({ id }) => id === tokenToId);
        if (to?.id) {
          dispatch(swapViewActions.setToken({ data: 'to', tokenId: to.id }));
          dispatch(swapViewActions.setValue({ data: 'to', value: '' }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    handleChangeValue(from.value, 'from');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to.metadata]);

  return {
    step,
    isButtonDisabled,
    buttonMessage,
    canHeldInSonic,
    isAutoSlippage,
    headerTitle,
    isConnected,
    isLoading,
    isBalancesUpdating,
    isPriceUpdating,
    priceImpact,
    fromSources,
    toSources,
    currentOperation,
    isICPSelected,

    isExplanationTooltipVisible,
    isSelectTokenButtonDisabled,
    selectTokenButtonText,
    setStep,
    setLastChangedInputDataKey,
    onButtonClick: handleButtonClick,
    onMenuClose: handleMenuClose,
    onSetSlippage: handleSetSlippage,
    onSetIsAutoSlippage: handleSetIsAutoSlippage,
    onChangeValue: handleChangeValue,
    onSelectToken: handleSelectToken,
    onMaxClick: handleMaxClick,
    onSwitchTokens: handleSwitchTokens,
  };
};

