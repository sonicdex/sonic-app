import {
  forwardRef,
  keyframes,
  Text,
  TextProps,
  Tooltip,
} from '@chakra-ui/react';
import { formatAmount } from '@psychedelic/sonic-js';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { getCurrencyString } from '@/utils/format';

export type DisplayValueProps = TextProps & {
  isUpdating?: boolean;
  value?: number | string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  disableTooltip?: boolean;
};

export const DisplayValue = forwardRef<DisplayValueProps, 'p'>(
  (
    {
      value = 0,
      decimals,
      isUpdating,
      prefix,
      suffix,
      disableTooltip,
      ...textProps
    },
    ref
  ) => {
    const blinker = keyframes`
      50% {
        opacity: 0.35;
      }
    `;

    const [formattedValue, tooltipLabel, isDisabled] = useMemo(() => {
      const tooltipAmount = decimals
        ? getCurrencyString(value, decimals)
        : new BigNumber(value).toString();
      const display = formatAmount(tooltipAmount);

      return [
        display,
        tooltipAmount,
        disableTooltip || String(tooltipAmount).length <= 4,
      ];
    }, [value, decimals, disableTooltip]);

    return (
      <Tooltip label={tooltipLabel} isDisabled={isDisabled}>
        <Text
          ref={ref}
          {...textProps}
          animation={isUpdating ? `${blinker} 1s linear infinite` : undefined}
        >
          {prefix}
          {formattedValue}
          {suffix}
        </Text>
      </Tooltip>
    );
  }
);
