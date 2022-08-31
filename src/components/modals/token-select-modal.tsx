import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { deserialize } from '@psychedelic/sonic-js';
import { FaHdd } from '@react-icons/all-files/fa/FaHdd';
import { useEffect, useMemo, useState } from 'react';

import { arrowBackSrc, questionMarkSrc } from '@/assets';
import { useBalances } from '@/hooks/use-balances';
import { AppTokenMetadata } from '@/models';
import {
  FeatureState,
  modalsSliceActions,
  useAppDispatch,
  useModalsStore,
} from '@/store';
import { ExternalLink } from '@/utils';

import { DisplayValue, SearchBar } from '..';
import { ImportToken } from './components';

export const TokenSelectModal = () => {
  const dispatch = useAppDispatch();
  const {
    tokenSelectModalData: tokenSelectData,
    isTokenSelectModalModalOpened: isTokenSelectOpened,
  } = useModalsStore();

  const {
    tokens,
    onSelect,
    selectedTokenIds,
    isLoading = false,
    allowAddToken, // This controls if token can be imported
  } = tokenSelectData;

  const [addToken, setAddToken] = useState(false);
  const [importTokenData, setImportTokenData] = useState({
    name: '',
    symbol: '',
    logo: '',
    id: '',
  });
  const parsedTokens = useMemo(() => deserialize(tokens), [tokens]);
  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] =
    useState<AppTokenMetadata[]>(parsedTokens);
  const { totalBalances } = useBalances();

  useEffect(() => {
    const filterFunction = ({ symbol, name }: Partial<AppTokenMetadata>) => {
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

  const handleSelect = (tokenId?: string) => {
    onSelect(tokenId);
    handleTokenSelectClose();
  };

  const handleImportToken = (tokenData: any) => {
    setAddToken(true);
    setImportTokenData(importTokenData);
  };

  const importToken = () => {
    // TODO: Import token integration
    handleTokenSelectClose();
  };

  const handleTokenSelectClose = () => {
    setSearch('');
    dispatch(modalsSliceActions.closeTokenSelectModal());
  };

  const bg = useColorModeValue('white', 'custom.2');
  const color = useColorModeValue('gray.600', 'custom.1');
  const emptyColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Modal
      isOpen={isTokenSelectOpened}
      onClose={handleTokenSelectClose}
      scrollBehavior="inside"
      isCentered
      size="md"
    >
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalCloseButton zIndex="docked" />
        <ModalHeader>
          {addToken ? (
            <Box
              onClick={() => setAddToken(false)}
              position="absolute"
              p={2}
              top={3}
              left={4}
              cursor="pointer"
              transition="background 400ms"
              _hover={{
                background: 'custom.3',
              }}
            >
              <Image src={arrowBackSrc} alt="Back" />
            </Box>
          ) : (
            <Flex
              w="100%"
              direction="column"
              alignItems="center"
              position="sticky"
              bg={bg}
              top={0}
            >
              <Heading as="h1" fontWeight={700} fontSize="lg">
                Select Token
              </Heading>
              <Box fontSize="md" px="10px" w="100%" mt={4}>
                <SearchBar search={search} setSearch={setSearch} />
              </Box>
            </Flex>
          )}
        </ModalHeader>
        <ModalBody>
          {addToken ? (
            <>
              <ImportToken
                id={importTokenData?.id}
                symbol={importTokenData?.symbol}
                name={importTokenData?.name}
                handleImport={importToken}
              />
            </>
          ) : (
            <Stack width="100%" direction="column">
              {isLoading &&
                [...Array(4)].map(() => <TokenSelectItemSkeleton />)}
              {!isLoading && filteredList.length > 0 ? (
                filteredList.map(({ id, logo, symbol, decimals, name }) => (
                  <TokenSelectItem
                    key={id}
                    balance={totalBalances && totalBalances[id]}
                    symbol={symbol}
                    decimals={decimals}
                    name={name}
                    onSelect={() => handleSelect(id)}
                    isLoading={isLoading}
                    isSelected={selectedTokenIds?.includes(id)}
                    logoSrc={logo}
                  />
                ))
              ) : (
                <Stack color={emptyColor} alignItems="center" pt={2}>
                  <Icon as={FaHdd} />

                  <Text textAlign="center">
                    Can't see your token? Request it to be added to Sonic using
                    the button below.
                  </Text>
                </Stack>
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
                        alt={importTokenData.symbol}
                        src={importTokenData.logo}
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
                      <Text pl={2} color={color}>
                        {importTokenData.name}
                      </Text>
                    </Skeleton>
                  </Flex>
                  <Skeleton isLoaded={!isLoading} minWidth={17} ml={2}>
                    <Button
                      width="fit-content"
                      variant="gradient"
                      colorScheme="dark-blue"
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
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            as={Link}
            href={ExternalLink.tokenRequestForm}
            isFullWidth
            variant="gradient"
            colorScheme="dark-blue"
            target="_blank"
            rel="noopener noreferrer"
          >
            Request Token (Soon)
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type TokenSelectItemProps = Partial<{
  balance: number;
  onSelect: any;
  name: string;
  symbol: string;
  decimals: number;
  isSelected: boolean;
  isLoading: boolean;

  logoSrc: string;
}>;

const TokenSelectItem = ({
  balance = 0,
  onSelect,
  name = '',
  symbol = '',
  decimals = 0,
  isSelected = false,
  isLoading = false,
  logoSrc = questionMarkSrc,
}: TokenSelectItemProps) => {
  const { balancesState } = useBalances();

  const isBalancesUpdating = useMemo(() => {
    return balancesState === FeatureState.Updating;
  }, [balancesState]);

  const nameColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      py={3}
      px={3}
      cursor="pointer"
      width="100%"
      transition="border 400ms"
      border="1px solid"
      borderColor={isSelected ? 'gray.600' : 'transparent'}
      borderRadius="20px"
      onClick={onSelect}
      _hover={{
        borderColor: 'custom.4',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={4}>
        <Skeleton isLoaded={!isLoading}>
          <Image alt={symbol} src={logoSrc} w={8} h={8} borderRadius={40} />
        </Skeleton>
        <Box>
          <Skeleton isLoaded={!isLoading} minWidth="fit-content">
            <Text fontWeight={700} maxWidth="100%">
              {symbol}
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!isLoading} flex={1} overflow="hidden">
            <Tooltip label={name} openDelay={1000}>
              <Text fontSize="sm" color={nameColor}>
                {name}
              </Text>
            </Tooltip>
          </Skeleton>
        </Box>
      </Stack>
      <Skeleton isLoaded={!isLoading} minWidth="fit-content" ml={3}>
        <DisplayValue
          isUpdating={isBalancesUpdating}
          value={balance}
          decimals={decimals}
          fontSize="18px"
          fontWeight={700}
          textAlign="right"
          shouldDivideByDecimals
        />
      </Skeleton>
    </Flex>
  );
};

const TokenSelectItemSkeleton = () => (
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

