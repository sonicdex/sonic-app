import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/popover';
import { Heading, HStack, Image } from '@chakra-ui/react';
import { FC } from 'react';

import { TokenSource } from '@/components';

import { TokenPopoverItem } from './token-popover-item';

type TokenPopoverProps = {
  symbol?: string;
  decimals?: number;
  sources?: TokenSource[];
};

export const TokenPopover: FC<TokenPopoverProps> = ({
  symbol,
  decimals,
  sources = [],
}) => {
  sources = sources.filter((source) => source.balance && source.balance > 0);

  if (sources.length === 0) {
    return null;
  }

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <HStack spacing={1}>
          {sources.map((source) => (
            <Image key={source?.src} src={source?.src} />
          ))}
        </HStack>
      </PopoverTrigger>
      <PopoverContent color="gray.50">
        <PopoverArrow />
        <PopoverHeader>
          <Heading as="h3" size="sm">
            Balance Breakdown
          </Heading>
        </PopoverHeader>
        <PopoverBody>
          {sources.map((source) => (
            <TokenPopoverItem
              key={source.name}
              decimals={decimals}
              symbol={symbol}
              {...source}
            />
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
