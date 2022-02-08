import { Flex, Heading, HStack, Link } from '@chakra-ui/react';
import { FaCube } from '@react-icons/all-files/fa/FaCube';
import { useMemo } from 'react';

import {
  Asset,
  AssetImageBlock,
  AssetTitleBlock,
  DisplayValue,
} from '@/components';
import { ENV } from '@/config';
import { LedgerTransaction } from '@/integrations/ledger';
import { AppTokenMetadata } from '@/models';
import { useSwapCanisterStore } from '@/store';
import { createICRocksLink } from '@/utils/function';

export type LedgerTransactionActivityProps = LedgerTransaction;

const getTokenByAddress = (
  address: string,
  tokenList?: AppTokenMetadata[]
): AppTokenMetadata | undefined => {
  if (!tokenList) return;

  const findToken = (tokenPrincipal: string) =>
    tokenList.find((token) => token.id === tokenPrincipal);

  switch (address) {
    case ENV.accountIDs.WICP:
      return findToken(ENV.canistersPrincipalIDs.WICP);
    case ENV.accountIDs.XTC:
      return findToken(ENV.canistersPrincipalIDs.XTC);
  }
};

export const LedgerTransactionActivity = ({
  amount,
  account1Address,
  account2Address,
  timestamp,
  blockIndex,
  hash,
}: LedgerTransactionActivityProps) => {
  const { supportedTokenList } = useSwapCanisterStore();

  const [action, token] = useMemo(() => {
    const from = getTokenByAddress(account1Address, supportedTokenList);
    if (from) return ['from', from];

    const to = getTokenByAddress(account2Address, supportedTokenList);
    if (to) return ['to mint', to];

    return ['unknown', undefined];
  }, [account1Address, account2Address, supportedTokenList]);

  if (!token) return null;

  return (
    <Asset type="token" imageSources={[token.logo]}>
      <HStack spacing={4}>
        <AssetImageBlock />
        <AssetTitleBlock
          title={`ICP transfer ${action} ${token.symbol}`}
          subtitle={timestamp.toLocaleTimeString('en-US')}
        />
      </HStack>
      <Flex textAlign="end" direction="column">
        <Heading
          as="h6"
          size="sm"
          display="flex"
          alignItems="flex-end"
          justifyContent="flex-end"
          mt="1"
          mb="0.5"
        >
          <DisplayValue
            value={amount.toString()}
            decimals={token.decimals}
            suffix={' ICP'}
          />
        </Heading>
        <Link
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontSize="sm"
          href={createICRocksLink(hash)}
          target="_blank"
          color="gray.400"
        >
          {blockIndex}&nbsp;
          <FaCube />
        </Link>
      </Flex>
    </Asset>
  );
};
