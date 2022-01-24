import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  forwardRef,
  HStack,
  Icon,
  Image,
  ImageProps,
  Skeleton,
  Text,
  TextProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { createContext } from '@chakra-ui/react-utils';
import { FaChevronDown } from '@react-icons/all-files/fa/FaChevronDown';
import React, { useCallback, useMemo } from 'react';

import { questionMarkSrc } from '@/assets';
import { NumberInput } from '@/components';
import { AppTokenMetadata } from '@/models';
import {
  calculatePriceBasedOnAmount,
  getDepositMaxValue,
} from '@/utils/format';

import { DisplayValue, NumberInputProps } from '..';
import { TokenBalancesPopover } from '../token-balances-popover';

// === Core ===

export type TokenUniqueProps = {
  value?: string;
  tokenMetadata?: AppTokenMetadata;
  tokenListMetadata?: AppTokenMetadata[];
  sources?: TokenSource[];
  setValue?: (value: string) => unknown;
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
  const borderGlow = useColorModeValue('dark-blue.300', 'dark-blue.500');
  const borderNotGlow = useColorModeValue('gray.50', '#373737');
  const borderColor = shouldGlow ? borderGlow : borderNotGlow;

  const backgroundGlow = useColorModeValue('white', 'black');
  const backgroundNotGlow = useColorModeValue('gray.50', 'custom.2');
  const background = shouldGlow ? backgroundGlow : backgroundNotGlow;

  const shadow = useColorModeValue('base', 'none');

  return (
    <TokenProvider value={{ shouldGlow, ...tokenProps }}>
      <Box
        borderRadius={20}
        bg={background}
        border="1px solid"
        borderColor={borderColor}
        shadow={shadow}
        pt={5}
        px={5}
        pb={4}
        transition="border 400ms"
        position="relative"
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
    const { isLoading } = useTokenContext();
    return (
      <Button
        ref={ref}
        borderRadius="full"
        mr={5}
        minWidth="fit-content"
        {...props}
        isDisabled={isLoading || props.isDisabled}
      >
        {children}
        <Icon as={FaChevronDown} ml={2.5} width={3} />
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
        alt={`${tokenMetadata?.symbol} logo`}
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

export type TokenBalancesPriceProps = BoxProps & {
  priceImpact?: string;
};

export const TokenBalancesPrice: React.FC<TokenBalancesPriceProps> = ({
  priceImpact,
  ...props
}) => {
  const { isLoading, value, tokenMetadata } = useTokenContext();

  const isActive = useMemo(() => {
    if (isLoading || parseFloat(value || '0') <= 0) {
      return false;
    }

    return true;
  }, [isLoading, value]);

  const price = useMemo(() => {
    return calculatePriceBasedOnAmount({
      amount: value,
      price: tokenMetadata?.price,
    });
  }, [tokenMetadata, value]);
  const defaultColorActive = useColorModeValue('gray.800', 'gray.50');
  const defaultColorInactive = useColorModeValue('gray.600', 'gray.300');
  const defaultColor = isActive ? defaultColorActive : defaultColorInactive;

  const color = useMemo(() => {
    if (priceImpact) {
      const priceImpactNumber = parseFloat(priceImpact);
      const color =
        priceImpactNumber > 0
          ? 'green.500'
          : priceImpactNumber <= 0 && priceImpactNumber >= -1
          ? defaultColor
          : priceImpactNumber < -1 && priceImpactNumber >= -5
          ? 'yellow.500'
          : 'red.500';

      return color;
    }

    return defaultColor;
  }, [priceImpact, defaultColor]);

  return (
    <Skeleton isLoaded={!isLoading} borderRadius="full" minWidth={5}>
      <Flex transition="color 400ms" color={defaultColor} {...props}>
        {price !== '0' && <DisplayValue value={price} prefix="~$" />}
        &nbsp;
        {priceImpact && (
          <DisplayValue
            color={color}
            value={priceImpact}
            prefix="("
            suffix="%)"
          />
        )}
      </Flex>
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
      Number(getDepositMaxValue(tokenMetadata, totalTokenBalance)) !==
        Number(value)
    ) {
      return true;
    }

    return false;
  }, [onMaxClick, tokenMetadata, totalTokenBalance, value]);

  const color = useColorModeValue('gray.600', 'custom.1');

  return (
    <Skeleton isLoaded={!isLoading} borderRadius="full" minW={20}>
      <Flex direction="row" color={color} {...props}>
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
  const background = shouldGlow ? 'black' : 'custom.2';

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
    [tokenMetadata, setValue]
  );
  const activeColor = useColorModeValue('gray.800', 'gray.50');
  const inactiveColor = useColorModeValue('gray.400', 'custom.1');
  const color = isActive ? activeColor : inactiveColor;

  return (
    <Skeleton isLoaded={!isLoading} borderRadius="full">
      <NumberInput
        isDisabled={isDisabled}
        value={value}
        setValue={handleChange}
        color={color}
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
    bg="dark-blue.500"
  />
);
