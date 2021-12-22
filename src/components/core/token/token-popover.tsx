import { FC } from 'react';
import { Heading, HStack, Image } from '@chakra-ui/react';
import {
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/popover';

import { TokenPopoverItem } from './token-popover-item';
import { TokenSource } from '@/components';

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
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <HStack spacing={1}>
          {sources?.map((source) => (
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
          {sources?.map((source) => (
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
