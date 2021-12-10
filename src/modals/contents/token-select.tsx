import { useMemo, useState, useEffect } from 'react';
import {
  Heading,
  Flex,
  ModalCloseButton,
  Box,
  Stack,
  Skeleton,
} from '@chakra-ui/react';
import { DefaultTokensImage } from '@/constants';
import { questionMarkSrc } from '@/assets';
import { getCurrencyString, deserialize } from '@/utils/format';

import { theme } from '@/theme';
import { SearchBar } from '@/components';
import { ModalComponentProps } from '../modals';
import { TokenMetadata } from '@/models';

import { useTotalBalances } from '@/hooks/use-balances';

const SkeletonToken = () => (
  <Flex
    direction="row"
    alignItems="center"
    py={3}
    px={2}
    cursor="pointer"
    height={16}
    justifyContent="space-between"
    width="100%"
    transition="border 400ms"
    border="1px solid transparent"
    borderRadius={20}
  >
    <Flex direction="row" alignItems="center">
      <Skeleton isLoaded={false} height={10} width={10} borderRadius={40} />
      <Skeleton isLoaded={false} width={12} ml={3} height={7} />
      <Skeleton isLoaded={false} width={18} height={6} ml={2} />
    </Flex>
    <Skeleton isLoaded={false} minWidth={18} height={6} ml={2} />
  </Flex>
);

export const TokenSelect = ({
  currentModalData,
  onClose = () => {},
}: Partial<ModalComponentProps>) => {
  const {
    tokens,
    onSelect,
    selectedTokenIds,
    isLoading = false,
  } = currentModalData;

  const parsedTokens = useMemo(() => deserialize(tokens), [tokens]);
  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] = useState(parsedTokens);
  const { totalBalances } = useTotalBalances();

  useEffect(() => {
    const filterFunction = ({ symbol, name }: Partial<TokenMetadata>) => {
      if (search?.length === 0) {
        return true;
      }
      const lowerSearch = search.toLowerCase();

      return (
        symbol?.toLowerCase().includes(lowerSearch) ||
        name?.toLowerCase().includes(lowerSearch)
      );
    };

    const filteredItems = parsedTokens.filter(filterFunction);
    setFilteredList(filteredItems);
  }, [search, parsedTokens]);

  const handleSelect = (selected: boolean, tokenId?: string) => {
    if (selected) return;
    onSelect(tokenId);
    onClose();
  };

  return (
    <Flex
      height="modalHeight"
      direction="column"
      alignItems="center"
      bg="#1E1E1E"
      borderRadius={20}
      pt={5}
      px={4}
      position="relative"
    >
      <ModalCloseButton position="absolute" top={3} right={4} />
      <Heading as="h1" fontWeight={700} fontSize="18px">
        Select Token
      </Heading>
      <Box px="10px" w="100%" mt={4}>
        <SearchBar search={search} setSearch={setSearch} />
      </Box>
      <Stack
        direction="column"
        width="100%"
        overflow="auto"
        pb={4}
        _after={{
          content: "''",
          position: 'absolute',
          pointerEvents: 'none',
          height: 20,
          left: 0,
          right: 0,
          bottom: '-3px',
          borderRadius: '20px',
          background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.bg} 100%)`,
        }}
      >
        {isLoading && [...Array(4)].map((e, i) => <SkeletonToken />)}
        {!isLoading &&
          filteredList.map(
            ({
              id,
              logo = questionMarkSrc,
              symbol,
              name,
              decimals,
            }: Partial<TokenMetadata>) => {
              const currentTokenSymbol = symbol ?? '';
              const currentSelected = selectedTokenIds?.includes(id);
              const tokenOpacity = currentSelected ? 0.3 : 1;
              const currentBalance = getCurrencyString(
                id && totalBalances ? totalBalances[id] : 0,
                decimals
              );
              const logoSrc =
                DefaultTokensImage[currentTokenSymbol] ?? questionMarkSrc;

              return (
                <Flex
                  direction="row"
                  key={id}
                  alignItems="center"
                  py={3}
                  px={3}
                  cursor="pointer"
                  justifyContent="space-between"
                  width="100%"
                  transition="border 400ms"
                  border="1px solid transparent"
                  opacity={tokenOpacity}
                  borderRadius="20px"
                  onClick={() => {
                    handleSelect(currentSelected, id);
                  }}
                  _hover={{
                    border: !currentSelected && '1px solid #4F4F4F',
                  }}
                >
                  <Flex direction="row" alignItems="center">
                    <Skeleton isLoaded={!isLoading} borderRadius={40}>
                      <Box
                        as="img"
                        src={logoSrc}
                        w={10}
                        h={10}
                        borderRadius={40}
                      />
                    </Skeleton>
                    <Skeleton isLoaded={!isLoading} minWidth={4} ml={3}>
                      <Box fontWeight={700} fontSize="18px" pl={3}>
                        {symbol}
                      </Box>
                    </Skeleton>
                    <Skeleton isLoaded={!isLoading} minWidth={17} ml={2}>
                      <Box fontSize="16px" pl={2}>
                        {name}
                      </Box>
                    </Skeleton>
                  </Flex>
                  <Skeleton isLoaded={!isLoading} minWidth={17} ml={2}>
                    <Box
                      as="p"
                      fontSize="18px"
                      fontWeight={700}
                      textAlign="right"
                    >
                      {currentBalance}
                    </Box>
                  </Skeleton>
                </Flex>
              );
            }
          )}
      </Stack>
    </Flex>
  );
};
