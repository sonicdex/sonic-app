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

import { getAmountDividedByDecimals } from '@/utils/format';

export type DisplayValueProps = TextProps & {
  isUpdating?: boolean;
  value?: number | string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  disableTooltip?: boolean;
  shouldDivideByDecimals?: boolean;
};

export const DisplayValue = forwardRef<DisplayValueProps, 'p'>(
  (
    {
      value = 0,
      decimals = 4,
      isUpdating,
      prefix,
      suffix,
      disableTooltip,
      shouldDivideByDecimals,
      ...textProps
    },
    ref
  ) => {
    const blinker = keyframes`
      50% {
        opacity: 0.35;
      }
    `;

    const [formattedValue, tooltipAmount, isDisabled] = useMemo(() => {
      const tooltipAmount = shouldDivideByDecimals
        ? getAmountDividedByDecimals(value, decimals).toString()
        : new BigNumber(value).dp(decimals).toString();

      const formattedValue = formatAmount(tooltipAmount);

      return [
        formattedValue,
        tooltipAmount,
        disableTooltip || String(tooltipAmount).length <= 4,
      ];
    }, [value, decimals, disableTooltip, shouldDivideByDecimals]);

    return (
      <Tooltip label={tooltipAmount} isDisabled={isDisabled}>
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
