import { useMemo, useState, useEffect } from 'react';
import {
  Heading,
  Text,
  Flex,
  ModalCloseButton,
  Box,
  Stack,
  Skeleton,
  Image,
} from '@chakra-ui/react';
import { DefaultTokensImage } from '@/constants';
import { arrowBackSrc, questionMarkSrc } from '@/assets';
import { getCurrencyString, deserialize } from '@/utils/format';

import { theme } from '@/theme';
import { SearchBar, Button } from '@/components';
import { ModalComponentProps } from '../modals';
import { TokenMetadata } from '@/models';
import { ImportToken } from './components';

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

type SelectTokenProps = {
  search: string;
  setSearch: (arg0: string) => any;
  filteredList: Partial<TokenMetadata>[];
  selectedTokenIds: Array<string>;
  totalBalances: any;
  handleSelect: (arg0: any, arg1?: string) => any;
  onTokenImport: (arg0: object) => any;
  allowAddToken: boolean;
  isLoading?: boolean;
};

const SelectToken = ({
  search,
  setSearch,
  filteredList,
  isLoading = false,
  totalBalances,
  selectedTokenIds,
  handleSelect,
  onTokenImport,
  allowAddToken,
}: SelectTokenProps) => {
  // TODO: Dab integration
  const importTokenData = {
    img: questionMarkSrc,
    id: 'ex-amp-le-tok-en-id',
    symbol: 'TST',
    name: 'Tokn example',
  };

  const handleImportToken = () => {
    onTokenImport(importTokenData);
  };

  return (
    <Box height="modalHeight" width="100%" overflow="auto">
      <Flex
        w="100%"
        direction="column"
        alignItems="center"
        position="sticky"
        bg="#1E1E1E"
        top={0}
        zIndex={400}
      >
        <Heading as="h1" fontWeight={700} fontSize="18px">
          Select Token
        </Heading>
        <Box px="10px" w="100%" mt={4}>
          <SearchBar search={search} setSearch={setSearch} />
        </Box>
      </Flex>
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
              const currentSelected = id && selectedTokenIds?.includes(id);
              const tokenOpacity = currentSelected ? 0.3 : 1;
              const currentBalances = getCurrencyString(
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
                      <Image src={logoSrc} w={10} h={10} borderRadius={40} />
                    </Skeleton>
                    <Skeleton isLoaded={!isLoading} minWidth={4} ml={3}>
                      <Text fontWeight={700} fontSize="18px" pl={3}>
                        {symbol}
                      </Text>
                    </Skeleton>
                    <Skeleton isLoaded={!isLoading} minWidth={17} ml={2}>
                      <Text pl={2}>{name}</Text>
                    </Skeleton>
                  </Flex>
                  <Skeleton isLoaded={!isLoading} minWidth={17} ml={2}>
                    <Text
                      as="p"
                      fontSize="18px"
                      fontWeight={700}
                      textAlign="right"
                    >
                      {currentBalances}
                    </Text>
                  </Skeleton>
                </Flex>
              );
            }
          )}
        {allowAddToken && filteredList.length === 0 && (
          <Flex
            direction="row"
            alignItems="center"
            py={3}
            px={3}
            cursor="pointer"
            justifyContent="space-between"
            width="100%"
            transition="border 400ms"
            border="1px solid transparent"
            borderRadius="20px"
          >
            <Flex direction="row" alignItems="center">
              <Skeleton isLoaded={!isLoading} borderRadius={40}>
                <Image
                  src={importTokenData.img}
                  w={10}
                  h={10}
                  borderRadius={40}
                />
              </Skeleton>
              <Skeleton isLoaded={!isLoading} minWidth={4} ml={3}>
                <Text fontWeight={700} fontSize="18px" pl={3}>
                  {importTokenData.symbol}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={!isLoading} minWidth={17} ml={2}>
                <Text pl={2} color="#888E8F">
                  {importTokenData.name}
                </Text>
              </Skeleton>
            </Flex>
            <Skeleton isLoaded={!isLoading} minWidth={17} ml={2}>
              <Button
                width="fit-content"
                gradient="vertical"
                px={4}
                borderRadius={20}
                fontWeight={700}
                onClick={handleImportToken}
              >
                Import
              </Button>
            </Skeleton>
          </Flex>
        )}
      </Stack>
    </Box>
  );
};

export const TokenSelect = ({
  currentModalData,
  onClose = () => {},
}: Partial<ModalComponentProps>) => {
  const {
    tokens,
    onSelect,
    selectedTokenIds,
    isLoading = false,
    allowAddToken, // This controls if token can be imported
  } = currentModalData;

  const [addToken, setAddToken] = useState(false);
  const [importTokenData, setImportTokenData] = useState({
    name: '',
    symbol: '',
    logo: '',
    id: '',
  });
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

  const handleTokenImport = (tokenData: any) => {
    setAddToken(true);
    setImportTokenData(tokenData);
  };

  const importToken = () => {
    // TODO: Import token integration
    // TODO: Set selected token to imported token id
    onClose();
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      bg="#1E1E1E"
      borderRadius={20}
      pt={5}
      px={4}
      pb={8}
    >
      <ModalCloseButton position="absolute" top={3} right={4} zIndex={500} />
      {addToken ? (
        <>
          <Box
            onClick={() => setAddToken(false)}
            position="absolute"
            p={2}
            top={3}
            left={4}
            borderRadius={100}
            cursor="pointer"
            transition="background 400ms"
            _hover={{
              background: '#282828',
            }}
          >
            <Image src={arrowBackSrc} />
          </Box>
          <ImportToken
            id={importTokenData?.id}
            symbol={importTokenData?.symbol}
            name={importTokenData?.name}
            handleImport={importToken}
          />
        </>
      ) : (
        <SelectToken
          onTokenImport={handleTokenImport}
          totalBalances={totalBalances}
          selectedTokenIds={selectedTokenIds}
          search={search}
          setSearch={setSearch}
          isLoading={isLoading}
          filteredList={filteredList}
          handleSelect={handleSelect}
          allowAddToken={allowAddToken}
        />
      )}
    </Flex>
  );
};
