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

import { plugCircleSrc, sonicCircleSrc } from '@/assets';
import { TokenBoxPopoverItem } from './token-box-popover-item';
import { TokenBoxSource } from '@/components';

type TokenBoxPopoverProps = {
  symbol?: string;
  decimals?: number;
  sources?: TokenBoxSource[];
};

export const TokenBoxPopover: FC<TokenBoxPopoverProps> = ({
  symbol,
  decimals,
  sources = [],
}) => {
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <HStack spacing={1}>
          <Image src={plugCircleSrc} />
          <Image src={sonicCircleSrc} />
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
            <TokenBoxPopoverItem
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
