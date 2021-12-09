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

import { useBalances } from '@/hooks/use-balances';

const SkeletonToken = () => (
  <Flex
    direction="row"
    alignItems="center"
    py="12px"
    px="10px"
    cursor="pointer"
    height="66px"
    justifyContent="space-between"
    width="100%"
    transition="border 400ms"
    border="1px solid transparent"
    borderRadius="20px"
  >
    <Flex direction="row" alignItems="center">
      <Skeleton
        isLoaded={false}
        height="40px"
        width="40px"
        borderRadius="40px"
      />
      <Skeleton isLoaded={false} width="47px" ml={3} height="27px" />
      <Skeleton isLoaded={false} width="70px" height="24px" ml="6px" />
    </Flex>
    <Skeleton isLoaded={false} minWidth="70px" height="27px" ml="6px" />
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
  const { totalBalance } = useBalances();

  useEffect(() => {
    const filterFunction = ({
      symbol,
      name,
    }: {
      symbol: string;
      name: string;
    }) => {
      if (search?.length === 0) {
        return true;
      }
      const lowerSearch = search.toLowerCase();

      return (
        symbol.toLowerCase().includes(lowerSearch) ||
        name.toLowerCase().includes(lowerSearch)
      );
    };

    const filteredItems = parsedTokens.filter(filterFunction);
    setFilteredList(filteredItems);
  }, [search, parsedTokens]);

  const handleSelect = (selected: boolean, tokenId: string) => {
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
      pt="20px"
      px="10px"
      position="relative"
    >
      <ModalCloseButton position="absolute" top="10px" right="15px" />
      <Heading as="h1" fontWeight={700} fontSize="18px">
        Select Token
      </Heading>
      <Box px="10px" w="100%" mt="14px">
        <SearchBar search={search} setSearch={setSearch} />
      </Box>
      <Stack
        direction="column"
        width="100%"
        overflow="auto"
        pb="15px"
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
            }: {
              id: string;
              logo?: string;
              symbol: string;
              decimals?: number | BigInt;
              name: string;
            }) => {
              const currentTokenSymbol = symbol ?? '';
              const currentSelected = selectedTokenIds?.includes(id);
              const tokenOpacity = currentSelected ? 0.3 : 1;
              const currentBalance = getCurrencyString(
                id && totalBalance ? totalBalance[id] : 0,
                decimals
              );
              const logoSrc =
                DefaultTokensImage[currentTokenSymbol] ?? questionMarkSrc;

              return (
                <Flex
                  direction="row"
                  key={id}
                  alignItems="center"
                  py="12px"
                  px="10px"
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
                    <Skeleton isLoaded={!isLoading} minWidth="15px" ml={3}>
                      <Box fontWeight={700} fontSize="18px" pl={3}>
                        {symbol}
                      </Box>
                    </Skeleton>
                    <Skeleton isLoaded={!isLoading} minWidth="70px" ml="6px">
                      <Box fontSize="16px" pl="6px">
                        {name}
                      </Box>
                    </Skeleton>
                  </Flex>
                  <Skeleton isLoaded={!isLoading} minWidth="70px" ml="6px">
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
