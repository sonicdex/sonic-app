import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger } from '@chakra-ui/popover';

import { Heading, HStack, Image, useColorModeValue } from '@chakra-ui/react';
import { FC, useMemo } from 'react';

import { TokenSource } from '@/components';

import { TokenBalancesPopoverItem } from './token-balances-popover-item';

type TokenBalancesPopoverProps = {
  symbol?: string;
  decimals?: number;
  sources?: TokenSource[];
  children?: React.ReactNode;
};

export const TokenBalancesPopover: FC<TokenBalancesPopoverProps> = ({
  symbol, decimals, sources = [], children }) => {

  const filteredSources = useMemo(
    () => sources.filter((source) => source.balance && source.balance > 0),
    [sources]
  );

  const color = useColorModeValue('gray.800', 'gray.50');

  if (filteredSources.length === 0) { return null; }
const bg = useColorModeValue('app.background.body.light','app.background.body.dark')
  return (
    <Popover trigger="hover" >
      <PopoverTrigger>
        {children || (
          <HStack spacing={1}>
            {filteredSources.map((source) => (
              <Image borderRadius='full' boxSize='20px' key={source?.src} src={source?.src} alt={source.name} />
            ))}
          </HStack>
          
        )}
      </PopoverTrigger>
      <div>
        <PopoverContent color={color} bg={bg} >
          <PopoverArrow bg={bg} />
          <PopoverHeader>
            <Heading as="h3" size="sm"> Balance Breakdown</Heading>
          </PopoverHeader>
          <PopoverBody>
            {filteredSources.map((source) => (
              <TokenBalancesPopoverItem key={source.name} decimals={decimals} symbol={symbol} {...source} />
            ))}
          </PopoverBody>
        </PopoverContent>
      </div>
    </Popover>
  );
};
