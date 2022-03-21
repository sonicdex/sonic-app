import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/popover';
import { Heading, useColorModeValue } from '@chakra-ui/react';
import { FC, useMemo } from 'react';

import { LPBreakdownPopoverItem } from './lp-breakdown-popover-item';

export type LPBreakdown = {
  symbol: string;
  decimals: number;
  balance?: string;
  src?: string;
};

type LPBreakdownPopoverProps = {
  sources?: LPBreakdown[];
  children?: React.ReactNode;
};

export const LPBreakdownPopover: FC<LPBreakdownPopoverProps> = ({
  sources = [],
  children,
}) => {
  const filteredSources = useMemo(
    () =>
      sources.filter((source) => source.balance && Number(source.balance) > 0),
    [sources]
  );

  const color = useColorModeValue('gray.800', 'gray.50');

  if (filteredSources.length === 0) {
    return null;
  }

  return (
    <Popover trigger="hover">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent color={color}>
        <PopoverArrow />
        <PopoverHeader>
          <Heading as="h3" size="sm">
            LP Breakdown
          </Heading>
        </PopoverHeader>
        <PopoverBody>
          {filteredSources.map((source) => (
            <LPBreakdownPopoverItem key={source.symbol} {...source} />
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
