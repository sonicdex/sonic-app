import {
  Skeleton,
  Text,
  Box,
  Flex,
  Image,
  HStack,
  Button,
} from '@chakra-ui/react';

import { chevronDownSrc, questionMarkSrc } from '@/assets';
import { useModalStore } from '@/store';
import { Modals } from '@/modals';
import { NumberInput } from '@/components';
import { DefaultTokensImage } from '@/constants';
import { TokenMetadata } from '@/models';
import { getCurrencyString, stringify } from '@/utils/format';
import { TokenBoxPopover } from './token-box-popover';
import NumberFormat from 'react-number-format';
import { useMemo } from 'react';

export type TokenBoxSource = {
  name: string;
  src: string;
  balance?: number;
};

type TokenBoxProps = {
  value?: string;
  setValue?: (value: string) => any;
  price?: number;
  otherTokensMetadata?: Array<TokenMetadata>;
  selectedTokenMetadata?: TokenMetadata;
  balanceText?: string;
  menuDisabled?: boolean;
  disabled?: boolean;
  priceText?: string;
  status?: string;
  glow?: boolean;
  isLoading?: boolean;
  selectedTokenIds?: string[];
  sources?: TokenBoxSource[];
  onTokenSelect?: (arg0: string) => any;
  onMaxClick?: () => unknown | Promise<unknown>;
};

export const TokenBox = ({
  status,
  value = '',
  setValue = () => null,
  otherTokensMetadata,
  selectedTokenMetadata,
  sources,
  balanceText,
  priceText,
  price,
  selectedTokenIds = [],
  menuDisabled = false,
  disabled = false,
  glow = false,
  isLoading = false,
  onTokenSelect,
  onMaxClick,
}: TokenBoxProps) => {
  const { setCurrentModal, setCurrentModalData, clearModal } = useModalStore();

  const border = glow ? '1px solid #3D52F4' : '1px solid #373737';
  const background = glow ? '#151515' : '#1E1E1E';

  const totalTokenBalance = useMemo(
    () =>
      sources?.reduce((acc, current) => acc + (current.balance ?? 0), 0) ?? 0,
    [sources]
  );

  const toggleModal = () => {
    if (isLoading || menuDisabled) return;
    clearModal();
    setCurrentModalData({
      tokens: stringify(otherTokensMetadata),
      onSelect: onTokenSelect,
      selectedTokenIds,
    });
    setCurrentModal(Modals.TokenSelect);
  };

  const shouldRenderMaxButton = useMemo(() => {
    if (
      onMaxClick &&
      totalTokenBalance > 0 &&
      Number(
        getCurrencyString(totalTokenBalance, selectedTokenMetadata?.decimals)
      ) > Number(value)
    ) {
      return true;
    }

    return false;
  }, [onMaxClick, totalTokenBalance, value]);

  const selectedTokenSymbol = selectedTokenMetadata?.symbol ?? '';
  const logoSrc = DefaultTokensImage[selectedTokenSymbol] ?? questionMarkSrc;

  return (
    <Box
      borderRadius={20}
      bg={background}
      border={border}
      pt={5}
      px={5}
      pb={4}
      transition="border 400ms"
      position="relative"
      _hover={{ border }}
    >
      {glow && (
        <Box
          position="absolute"
          borderRadius={20}
          top={0}
          left={0}
          width="100%"
          height="100%"
          filter="blur(6px)"
          zIndex={-100}
          bg="#3D52F4"
        />
      )}
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Flex
          direction="row"
          alignItems="center"
          borderRadius={20}
          bg="#282828"
          pl={2.5}
          pr={3}
          py={2}
          cursor="pointer"
          onClick={toggleModal}
        >
          <Skeleton
            isLoaded={!isLoading}
            height={5}
            width={5}
            borderRadius="full"
            mr={2}
          >
            <Image width={5} height={5} borderRadius={5} src={logoSrc} />
          </Skeleton>
          <Skeleton
            isLoaded={!isLoading}
            height={6}
            width="fit-content"
            mr={2.5}
          >
            <Text
              fontWeight={700}
              fontSize="lg"
              width="fit-content"
              minWidth={10}
            >
              {selectedTokenMetadata?.symbol}
            </Text>
          </Skeleton>
          {!menuDisabled && <Image width="11px" src={chevronDownSrc} />}
        </Flex>
        <Skeleton isLoaded={!isLoading} borderRadius="full">
          <NumberInput
            value={value}
            setValue={setValue}
            isDisabled={disabled}
            style={{
              color: status === 'active' ? '#F6FCFD' : '#888E8F',
              background,
            }}
          />
        </Skeleton>
      </Flex>
      <Flex direction="row" justifyContent="space-between">
        <Skeleton isLoaded={!isLoading} borderRadius="full" minW={20}>
          <Flex direction="row" color="#888E8F">
            {balanceText ?? (
              <HStack>
                <TokenBoxPopover
                  sources={sources}
                  decimals={selectedTokenMetadata?.decimals}
                  symbol={selectedTokenMetadata?.symbol}
                />
                <Text>
                  Balance:{' '}
                  {getCurrencyString(
                    totalTokenBalance,
                    selectedTokenMetadata?.decimals
                  )}{' '}
                  {selectedTokenMetadata?.symbol}{' '}
                  {shouldRenderMaxButton && (
                    <Button variant="link" onClick={onMaxClick}>
                      (max)
                    </Button>
                  )}
                </Text>
              </HStack>
            )}
          </Flex>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} borderRadius="full">
          <Box
            transition="color 400ms"
            color={status === 'active' ? '#F6FCFD' : '#888E8F'}
          >
            {priceText ?? (
              <NumberFormat value={price} displayType="text" prefix="$" />
            )}
          </Box>
        </Skeleton>
      </Flex>
    </Box>
  );
};
