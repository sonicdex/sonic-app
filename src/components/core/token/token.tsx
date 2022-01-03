import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  forwardRef,
  HStack,
  Image,
  ImageProps,
  Skeleton,
  Text,
  TextProps,
} from '@chakra-ui/react';
import { createContext } from '@chakra-ui/react-utils';
import React, { useCallback, useMemo } from 'react';

import { chevronDownSrc, questionMarkSrc } from '@/assets';
import { NumberInput } from '@/components';
import { AppTokenMetadata } from '@/models';
import { getCurrencyString } from '@/utils/format';

import { DisplayValue, NumberInputProps } from '..';
import { TokenBalancesPopover } from '../token-balances-popover';

// === Core ===

export type TokenUniqueProps = {
  value?: string;
  tokenMetadata?: AppTokenMetadata;
  tokenListMetadata?: AppTokenMetadata[];
  sources?: TokenSource[];
  setValue?: (value: string) => any;
  isDisabled?: boolean;
  isLoading?: boolean;
  isBalancesLoading?: boolean;
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

type TokenDetailsButtonProps = ButtonProps;

export const TokenDetailsButton = forwardRef<TokenDetailsButtonProps, 'button'>(
  ({ children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        borderRadius="full"
        mr={5}
        minWidth="fit-content"
        {...props}
      >
        {children}
        <Image ml={2.5} width={3} src={chevronDownSrc} />
      </Button>
    );
  }
);

type TokenDetailsLogo = ImageProps;

export const TokenDetailsLogo: React.FC<TokenDetailsLogo> = (props) => {
  const { isLoading, tokenMetadata } = useTokenContext();

  const logoSrc = tokenMetadata?.logo ?? questionMarkSrc;

  return (
    <Skeleton
      isLoaded={!isLoading}
      height={5}
      width={5}
      borderRadius="full"
      mr={2}
    >
      <Image
        width={5}
        minW={5}
        height={5}
        minH={5}
        borderRadius="full"
        src={logoSrc}
        {...props}
      />
    </Skeleton>
  );
};

export const TokenDetailsSymbol: React.FC<TextProps> = (props) => {
  const { isLoading, tokenMetadata } = useTokenContext();

  return (
    <Skeleton isLoaded={!isLoading} height={5} width="fit-content">
      <Text
        fontWeight={700}
        fontSize="lg"
        width="fit-content"
        minWidth={5}
        {...props}
      >
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
  const { isLoading, value, tokenMetadata } = useTokenContext();

  const isActive = useMemo(() => {
    if (isLoading || parseFloat(value || '0') <= 0) {
      return false;
    }

    return true;
  }, [isLoading, value]);

  return (
    <Skeleton isLoaded={!isLoading} borderRadius="full">
      <Box
        transition="color 400ms"
        color={isActive ? '#F6FCFD' : '#888E8F'}
        {...props}
      >
        <DisplayValue value={tokenMetadata?.price ?? 0} prefix="$" />
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
    () => sources?.reduce((acc, current) => acc + (current.balance ?? 0), 0),
    [sources]
  );

  const shouldRenderMaxButton = useMemo(() => {
    if (
      onMaxClick &&
      totalTokenBalance &&
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
          <TokenBalancesPopover
            sources={sources}
            decimals={tokenMetadata?.decimals}
            symbol={tokenMetadata?.symbol}
          />

          {typeof totalTokenBalance === 'number' && (
            <DisplayValue
              value={totalTokenBalance}
              decimals={tokenMetadata?.decimals || 0}
              prefix="Balance: "
              suffix={tokenMetadata?.symbol && ` ${tokenMetadata?.symbol}`}
            />
          )}

          {shouldRenderMaxButton && (
            <Button variant="link" onClick={onMaxClick}>
              (Max)
            </Button>
          )}
        </HStack>
      </Flex>
    </Skeleton>
  );
};

// === Input ===

type TokenInputProps = NumberInputProps;

export const TokenInput: React.FC<TokenInputProps> = (props) => {
  const { isLoading, isDisabled, shouldGlow, value, setValue, tokenMetadata } =
    useTokenContext();
  const background = shouldGlow ? '#151515' : '#1E1E1E';

  const isActive = useMemo(() => {
    if (isLoading || parseFloat(value || '0') <= 0) {
      return false;
    }

    return true;
  }, [isLoading, value]);

  const handleChange = useCallback(
    (_value: string) => {
      // Handle zeros on left
      // Handle only one dot in input
      // Handle only token decimals in input
      if (tokenMetadata && setValue) {
        if (_value === '') return setValue('');
        const [nat, decimals] = _value.split('.');
        let newValue = parseInt(nat) > 0 ? nat.replace(/^0+/, '') : '0';
        if (_value.includes('.') && tokenMetadata.decimals > 0) {
          newValue += '.';
        }
        if (decimals) {
          newValue += `${decimals.slice(0, tokenMetadata.decimals)}`;
        }
        setValue(newValue);
      }
    },
    [value, tokenMetadata]
  );

  return (
    <Skeleton isLoaded={!isLoading} borderRadius="full">
      <NumberInput
        isDisabled={isDisabled}
        value={value}
        setValue={handleChange}
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
