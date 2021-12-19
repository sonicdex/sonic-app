import {
  Skeleton,
  Text,
  Box,
  Flex,
  Image,
  HStack,
  Button,
  BoxProps,
  FlexProps,
  ImageProps,
} from '@chakra-ui/react';
import { createContext } from '@chakra-ui/react-utils';
import NumberFormat from 'react-number-format';
import React, { useMemo } from 'react';

import { chevronDownSrc, questionMarkSrc } from '@/assets';
import { NumberInput } from '@/components';
import { DefaultTokensImage } from '@/constants';
import { TokenMetadata } from '@/models';
import { getCurrencyString } from '@/utils/format';

import { TokenPopover } from './token-popover';
import { NumberInputProps } from '..';

// === Core ===

export type TokenUniqueProps = {
  value?: string;
  price?: string | number;
  tokenMetadata?: TokenMetadata;
  tokenListMetadata?: Array<TokenMetadata>;
  sources?: TokenSource[];
  setValue?: (value: string) => any;
  isDisabled?: boolean;
  isLoading?: boolean;
  shouldGlow?: boolean;
};

export type TokenProps = TokenUniqueProps & {
  htmlProps?: BoxProps;
};

const [TokenProvider, useTokenContext] = createContext<TokenUniqueProps>({
  name: 'TokenContext',
  errorMessage:
    'useTokenContext: `context` is undefined. Seems you forgot to wrap all card components within `<Card />`',
});

export type TokenSource = {
  name: string;
  src: string;
  balance?: number;
};

export const Token: React.FC<TokenProps> = ({
  shouldGlow = false,
  htmlProps,
  children,
  ...tokenProps
}) => {
  const border = shouldGlow ? '1px solid #3D52F4' : '1px solid #373737';
  const background = shouldGlow ? '#151515' : '#1E1E1E';

  return (
    <TokenProvider value={{ shouldGlow, ...tokenProps }}>
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
        {...htmlProps}
      >
        {shouldGlow && <TokenGlow />}
        {children}
      </Box>
    </TokenProvider>
  );
};

type TokenContentProps = FlexProps;

export const TokenContent: React.FC<TokenContentProps> = (props) => {
  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={3}
      {...props}
    />
  );
};

// === Details ===

type TokenDetailsProps = FlexProps;

export const TokenDetails: React.FC<TokenDetailsProps> = ({
  children,
  ...props
}) => {
  return (
    <Flex
      direction="row"
      alignItems="center"
      borderRadius={20}
      bg="#282828"
      pl={2.5}
      pr={3}
      py={2}
      cursor="pointer"
      {...props}
    >
      {children}
      <Image width={3} src={chevronDownSrc} />
    </Flex>
  );
};

type TokenDetailsLogo = ImageProps;

export const TokenDetailsLogo: React.FC<TokenDetailsLogo> = (props) => {
  const { isLoading, tokenMetadata } = useTokenContext();

  const logoSrc =
    DefaultTokensImage[tokenMetadata?.symbol ?? ''] ?? questionMarkSrc;

  return (
    <Skeleton
      isLoaded={!isLoading}
      height={5}
      width={5}
      borderRadius="full"
      mr={2}
    >
      <Image width={5} height={5} borderRadius={5} src={logoSrc} {...props} />
    </Skeleton>
  );
};

export const TokenDetailsSymbol: React.FC<FlexProps> = (props) => {
  const { isLoading, tokenMetadata } = useTokenContext();

  return (
    <Skeleton isLoaded={!isLoading} height={6} width="fit-content" mr={2.5}>
      <Text fontWeight={700} fontSize="lg" width="fit-content" minWidth={10}>
        {tokenMetadata?.symbol}
      </Text>
    </Skeleton>
  );
};

// === Balances ===

export const TokenBalances = (props: FlexProps) => {
  return <Flex direction="row" justifyContent="space-between" {...props} />;
};

export const TokenBalancesPrice: React.FC<BoxProps> = (props) => {
  const { isLoading, isDisabled, price, value } = useTokenContext();

  const isActive = useMemo(() => {
    if (isLoading || isDisabled || parseFloat(value ?? '0') <= 0) {
      return false;
    }

    return true;
  }, [isLoading, isDisabled, value]);

  return (
    <Skeleton isLoaded={!isLoading} borderRadius="full">
      <Box
        transition="color 400ms"
        color={isActive ? '#F6FCFD' : '#888E8F'}
        {...props}
      >
        <NumberFormat value={price} displayType="text" prefix="$" />
      </Box>
    </Skeleton>
  );
};

export type TokenBalancesDetailsProps = FlexProps & {
  onMaxClick?: () => unknown | Promise<unknown>;
};

export const TokenBalancesDetails: React.FC<TokenBalancesDetailsProps> = ({
  onMaxClick,
  ...props
}) => {
  const { isLoading, sources, tokenMetadata, value } = useTokenContext();

  const totalTokenBalance = useMemo(
    () =>
      sources?.reduce((acc, current) => acc + (current.balance ?? 0), 0) ?? 0,
    [sources]
  );

  const shouldRenderMaxButton = useMemo(() => {
    if (
      onMaxClick &&
      totalTokenBalance > 0 &&
      Number(getCurrencyString(totalTokenBalance, tokenMetadata?.decimals)) !==
        Number(value)
    ) {
      return true;
    }

    return false;
  }, [onMaxClick, totalTokenBalance, value]);

  return (
    <Skeleton isLoaded={!isLoading} borderRadius="full" minW={20}>
      <Flex direction="row" color="#888E8F" {...props}>
        <HStack>
          <TokenPopover
            sources={sources}
            decimals={tokenMetadata?.decimals}
            symbol={tokenMetadata?.symbol}
          />
          <Text>
            Balance:{' '}
            {getCurrencyString(totalTokenBalance, tokenMetadata?.decimals)}{' '}
            {tokenMetadata?.symbol}{' '}
            {shouldRenderMaxButton && (
              <Button variant="link" onClick={onMaxClick}>
                (max)
              </Button>
            )}
          </Text>
        </HStack>
      </Flex>
    </Skeleton>
  );
};

// === Input ===

type TokenInputProps = NumberInputProps;

export const TokenInput: React.FC<TokenInputProps> = (props) => {
  const { isLoading, isDisabled, shouldGlow, value, setValue } =
    useTokenContext();
  const background = shouldGlow ? '#151515' : '#1E1E1E';

  const isActive = useMemo(() => {
    if (isLoading || isDisabled || parseFloat(value ?? '0') <= 0) {
      return false;
    }

    return true;
  }, [isLoading, isDisabled, value]);

  return (
    <Skeleton isLoaded={!isLoading} borderRadius="full">
      <NumberInput
        isDisabled={isDisabled}
        value={value}
        setValue={setValue}
        color={isActive ? '#F6FCFD' : '#888E8F'}
        background={background}
        {...props}
      />
    </Skeleton>
  );
};

// === Other Internal Components ===

const TokenGlow = () => (
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
);
