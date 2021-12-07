import { chevronDownSrc, greyPlugSrc, greySonicSrc } from '@/assets';
import { NumberInput } from '@/components';
import { TokenMetadata } from '@/models';
import {
  Skeleton,
  Text,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from '@chakra-ui/react';

type TokenBoxProps = {
  value?: string;
  setValue?: (value: string) => any;
  onTokenSelect?: (token: string) => any;
  otherTokensMetadata?: Array<TokenMetadata>;
  selectedTokenMetadata?: TokenMetadata;
  balance?: string;
  amount?: string;
  source?: 'plug' | 'sonic' | null;
  balanceText?: string;
  menuDisabled?: boolean;
  disabled?: boolean;
  amountText?: string;
  status?: string;
  glow?: boolean;
  isLoading?: boolean;
};

const ChevronDownIcon = () => <Image src={chevronDownSrc} />;

const TokenOption = ({ logo, name }: TokenMetadata) => (
  <Flex direction="row" width="fit-content" alignItems="center">
    {logo && <Image src={logo} height={5} />}
    <Text fontWeight={700} color="#F6FCFD" ml={2}>
      {name}
    </Text>
  </Flex>
);

export const TokenBox = ({
  status,
  value = '',
  setValue = () => null,
  onTokenSelect,
  otherTokensMetadata,
  selectedTokenMetadata,
  source,
  balance,
  amount,
  balanceText,
  amountText,
  menuDisabled = false,
  disabled = false,
  glow = false,
  isLoading = false,
}: TokenBoxProps) => {
  const sourceImg = source === 'plug' ? greyPlugSrc : greySonicSrc;

  const border = glow ? '1px solid #3D52F4' : '1px solid #373737';
  const background = glow ? '#151515' : '#1E1E1E';

  const balanceDisplay = balanceText ? (
    balanceText
  ) : (
    <>
      Balance: {balance} {selectedTokenMetadata?.name}
    </>
  );

  const amountDisplay = amountText ? amountText : `$${amount}`;

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
      _hover={{
        border,
      }}
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
        <Menu>
          <Skeleton isLoaded={!isLoading} borderRadius="full" minW={20}>
            <MenuButton
              as={Button}
              rightIcon={!menuDisabled ? <ChevronDownIcon /> : null}
              borderRadius={20}
              py={2}
              pl={2.5}
              pr={3}
            >
              {selectedTokenMetadata && (
                <TokenOption {...selectedTokenMetadata} />
              )}
            </MenuButton>
          </Skeleton>
          {!menuDisabled && onTokenSelect && (
            <MenuList>
              {otherTokensMetadata?.map((token) => (
                <MenuItem
                  key={token.id}
                  onClick={() => onTokenSelect(token.id)}
                >
                  <TokenOption {...token} />
                </MenuItem>
              ))}
            </MenuList>
          )}
        </Menu>

        <Skeleton isLoaded={!isLoading} borderRadius="full">
          <NumberInput
            value={value}
            setValue={setValue}
            disabled={disabled}
            style={{
              color: status === 'active' ? '#F6FCFD' : '#888E8F',
              background,
            }}
          />
        </Skeleton>
      </Flex>
      <Flex direction="row" justifyContent="space-between">
        <Skeleton isLoaded={!isLoading} borderRadius="full" minW={20}>
          <Flex direction="row">
            {source && <Image src={sourceImg} mr={2} height={5} />}
            <Text color="#888E8F">{balanceDisplay}</Text>
          </Flex>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} borderRadius="full">
          <Box
            transition="color 400ms"
            color={status === 'active' ? '#F6FCFD' : '#888E8F'}
          >
            {amountDisplay}
          </Box>
        </Skeleton>
      </Flex>
    </Box>
  );
};
