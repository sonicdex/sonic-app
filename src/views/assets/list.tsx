import { Flex, HStack, Icon, Stack, Text, useColorModeValue, ButtonGroup, Button } from '@chakra-ui/react';
import { toBigNumber } from '@sonicdex/sonic-js';
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';
import { FaMinus } from '@react-icons/all-files/fa/FaMinus';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Asset, AssetIconButton, AssetImageBlock, AssetTitleBlock, DisplayValue, Header,
  InformationBox, WalletNotConnected, TokenBalancesPopover
} from '@/components';

import { getAppAssetsSources } from '@/config/utils';
import { ICP_METADATA } from '@/constants';
import { useBalances } from '@/hooks/use-balances';
import { AppTokenMetadata } from '@/models';

import {
  assetsViewActions, FeatureState, useAppDispatch, useAssetsViewStore,
  usePriceStore, useSwapCanisterStore, useWalletStore,
  useModalsStore
} from '@/store';


import { DepostAddressModal, RetryFailedTrxModal } from '@/components/modals';

const getAssetPriceByBalance = (price?: string, balance?: number, decimals?: number) => {
  if (price && balance && decimals) {
    return (
      Number(price) * Number(toBigNumber(balance).applyDecimals(decimals).toString())
    );
  }
  return price;
};

export const AssetsListView = () => {
  const dispatch = useAppDispatch();
  const { isBannerOpened } = useAssetsViewStore();
  const { totalBalances, sonicBalances, tokenBalances } = useBalances();
  const { supportedTokenListState, balancesState, supportedTokenList } = useSwapCanisterStore();
  const { tokenSelectModalData: tokenSelectData } = useModalsStore();
  const { pinnedTokens } = tokenSelectData;

  const { icpPrice } = usePriceStore();
  const { isConnected } = useWalletStore();

  const navigate = useNavigate();

  const navigateToDeposit = (tokenId?: string) => {
    if (tokenId) { navigate(`/assets/deposit?tokenId=${tokenId}`); }
  };

  const navigateToWithdraw = (tokenId?: string) => {
    if (tokenId) { navigate(`/assets/withdraw?tokenId=${tokenId}`); }
  };
  const navigateToTransfer = (tokenId?: string) => {
    if (tokenId) { navigate(`/assets/transfer?tokenId=${tokenId}`); }
  };

  const handleBannerClose = () => {
    dispatch(assetsViewActions.setIsBannerOpened(false));
  };


  const notEmptyTokenList = useMemo(() => {
    const supportedTokenListWithICP: AppTokenMetadata[] = [
      ...(supportedTokenList || []),
    ];
    if (totalBalances) {
      const filterdTokenList = supportedTokenListWithICP.filter(
        (token) => totalBalances[token.id] !== 0
      );
      const sortedTokenListWithPin = filterdTokenList.sort((a: any, b: any) => {
        const isAPinnned = pinnedTokens.includes(a.id);
        const isBPinned = pinnedTokens.includes(b.id);

        if (isAPinnned === isBPinned) return 0;
        return isAPinnned ? -1 : 1;
      })
      return sortedTokenListWithPin;
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportedTokenList, totalBalances, icpPrice, pinnedTokens]);

  const isTokenListPresent = useMemo(() => notEmptyTokenList && notEmptyTokenList.length > 0, [notEmptyTokenList]);

  const isLoading = useMemo(() =>
    supportedTokenListState === FeatureState.Loading ||
    balancesState === FeatureState.Loading,
    [supportedTokenListState, balancesState]
  );

  const isUpdating = useMemo(() =>
    supportedTokenListState === FeatureState.Updating ||
    balancesState === FeatureState.Updating,
    [supportedTokenListState, balancesState]
  );

  const assetsDetailsTextColor = useColorModeValue('gray.800', 'custom.1');
  const headerColor = useColorModeValue('gray.600', 'gray.400');

  const getCanWithdraw = useCallback(
    (tokenId: string) => {
      return (tokenId !== ICP_METADATA.id && sonicBalances && sonicBalances[tokenId] > 0);
    },
    [sonicBalances]
  );
  const [isModelOpen, setisModelOpen] = useState(false);
  const [tokenSelected, settokenSelected] = useState('');

  const [isFailedTrxOpen, setIsFailedTrxOpen] = useState(0);
  const retryFailedTrx = () => { var r = Math.random() * 100; setIsFailedTrxOpen(r); };

  const showDepositModal = function (tokenId: string) {
    setisModelOpen(true);
    settokenSelected(tokenId);
  }
 
  const getCanDeposit = useCallback(
    (tokenId: string) => {
      return (tokenId !== ICP_METADATA.id && tokenBalances && tokenBalances[tokenId] > 0);
    },
    [tokenBalances]
  );

  return (
    <>
      <RetryFailedTrxModal isRetryOpen={isFailedTrxOpen} />
      <DepostAddressModal isNotiOpen={isModelOpen} tokenId={tokenSelected} onclose={() => { setisModelOpen(false); }} />
      <Header title="Your Assets" isUpdating={isUpdating} >
        {isBannerOpened && (
          <InformationBox title="Assets Details" mb={9} onClose={handleBannerClose}>
            <Text color={assetsDetailsTextColor}>
              It is the representation of total token assets in your wallets and sonic wallet associated with this wallet account.
            </Text>
          </InformationBox>
        )}
        <Flex alignItems={'self-end'} w="100%" flexDirection="column">
          <Flex>
            <Button size="md" variant="gradient" colorScheme="dark-blue" isLoading={isLoading} onClick={retryFailedTrx}>
              Retry Failed Deposit
            </Button>
          </Flex>
        </Flex>
      </Header>

      {!isConnected ? (
        <WalletNotConnected message="Your assets will appear here." />
      ) : (
        <>
          <Flex alignItems={'self-end'} w="100%" flexDirection="column" mb='5'>
           
          </Flex>
          <Stack spacing={4} pb={8} flex={1}>
            {isLoading ? (
              <>
                <Asset isLoading>
                  <AssetImageBlock />
                  <HStack>
                    <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
                    <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
                    <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
                  </HStack>
                </Asset>
                <Asset isLoading>
                  <AssetImageBlock />
                  <HStack>
                    <AssetIconButton aria-label="Deposit" icon={<FaPlus />} />
                    <AssetIconButton aria-label="Withdraw" icon={<FaMinus />} />
                  </HStack>
                </Asset>
              </>
            ) : isTokenListPresent ? (
              notEmptyTokenList.map(
                ({ id, name, symbol, decimals, price, logo }) => (
                  <Asset key={id} imageSources={[logo]}>
                    <HStack spacing={4} flex={2} minW={['100%', '200px', '200px']} overflow="hidden" mr={4}>
                      <AssetImageBlock />
                      <AssetTitleBlock title={symbol} subtitle={name} maxW={['100%', '140px', '140px']} />
                    </HStack>
                    <TokenBalancesPopover
                      sources={getAppAssetsSources({
                        balances: {
                          wallet: id === ICP_METADATA.id ? totalBalances?.[id] : tokenBalances?.[id],
                          sonic: sonicBalances?.[id],
                        },
                      })}
                      decimals={decimals} symbol={symbol}
                    >
                      <Flex flex={1} direction="column">
                        <Text fontWeight="bold" color={headerColor} display="flex" alignItems="center">
                          Balance
                          <Icon as={FaInfoCircle} w={4} h={4} ml={1.5} opacity={0.45} />
                        </Text>
                        <DisplayValue isUpdating={isUpdating} value={totalBalances?.[id]}
                          decimals={decimals} fontWeight="bold" disableTooltip shouldDivideByDecimals
                        />
                      </Flex>
                    </TokenBalancesPopover>
                    <Flex flex={1} direction="column">
                      <Text fontWeight="bold" color={headerColor}>
                        Price
                      </Text>
                      <DisplayValue isUpdating={isUpdating} fontWeight="bold" prefix="~$"
                        value={
                          (id == 'ryjl3-tyaaa-aaaaa-aaaba-cai') ?
                            ((totalBalances?.[id]) ? (totalBalances?.[id] / 10 ** decimals) : 0) * (parseFloat(icpPrice || '1')) :
                            getAssetPriceByBalance(price, totalBalances?.[id], decimals) ?? 0
                        }
                      />
                    </Flex>
                    <HStack>
                      <AssetIconButton aria-label={`Withdraw ${symbol} From Sonic`} icon={<FaMinus />}
                        onClick={() => navigateToWithdraw(id)} isDisabled={!getCanWithdraw(id)}
                      />
                      <AssetIconButton colorScheme="dark-blue" aria-label={`Deposit ${symbol} to Sonic`} icon={<FaPlus />}
                        onClick={() => navigateToDeposit(id)} isDisabled={!getCanDeposit(id)}
                      />
                    </HStack>
                    <Flex flex={1} direction="column" alignItems='end' gap='2' minW={['100%']}>
                      <ButtonGroup gap='2'>
                        <Button fontSize={14} px={6} onClick={() => showDepositModal(id)} >Deposit</Button>
                        <Button fontSize={14} px={6} onClick={() => navigateToTransfer(id)} >Send</Button>
                      </ButtonGroup>
                    </Flex>
                  </Asset>
                )
              )
            ) : (
              <Text textAlign="center" color={headerColor}>
                No assets available
              </Text>
            )}
          </Stack>
        </>
      )}
    </>
  );
};
