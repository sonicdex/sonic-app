import {
  chevronDownSrc,
  greyPlugSrc,
  greySonicSrc,
  questionMarkSrc,
} from '@/assets';
import { useModalStore } from '@/store';
import { MODALS } from '@/modals';
import { NumberInput } from '@/components';
import { DefaultTokensImage } from '@/constants';
import { TokenMetadata } from '@/models';
import { Skeleton, Text, Box, Flex, Image } from '@chakra-ui/react';
import { stringify } from '@/utils/format';

type TokenBoxProps = {
  value?: string;
  setValue?: (value: string) => any;
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
  selectedTokenIds?: string[];
  onTokenSelect?: (arg0: string) => any;
};

export const TokenBox = ({
  status,
  value = '',
  setValue = () => null,
  otherTokensMetadata,
  onTokenSelect,
  selectedTokenMetadata,
  source,
  balance,
  amount,
  balanceText,
  amountText,
  selectedTokenIds = [],
  menuDisabled = false,
  disabled = false,
  glow = false,
  isLoading = false,
}: TokenBoxProps) => {
  const { setCurrentModal, setCurrentModalData, clearModal } = useModalStore();
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

  const toggleModal = () => {
    if (isLoading || menuDisabled) return;
    clearModal();
    setCurrentModalData({
      tokens: stringify(otherTokensMetadata),
      onSelect: onTokenSelect,
      selectedTokenIds,
    });
    setCurrentModal(MODALS.tokenSelect);
  };

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
        <Flex
          direction="row"
          alignItems="center"
          borderRadius="20px"
          bg="#282828"
          pl="10px"
          pr="12px"
          py="8px"
          cursor="pointer"
          onClick={toggleModal}
        >
          <Skeleton
            isLoaded={!isLoading}
            height="20px"
            width="20px"
            borderRadius="full"
            mr="7px"
          >
            <Image
              width="20px"
              height="20px"
              borderRadius="20px"
              src={logoSrc}
            />
          </Skeleton>
          <Skeleton
            isLoaded={!isLoading}
            height="25px"
            width="fit-content"
            mr="10px"
          >
            <Text
              fontWeight={700}
              fontSize="18px"
              width="fit-content"
              minWidth="40px"
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
