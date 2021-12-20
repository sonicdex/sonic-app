import { getCurrencyString, getDisplayCurrency } from '@/utils/format';
import { Text, TextProps, Tooltip } from '@chakra-ui/react';
import { useMemo } from 'react';

export type DisplayNumberProps = TextProps & {
  balance?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

export const DisplayCurrency: React.FC<DisplayNumberProps> = ({
  balance = 0,
  decimals = 0,
  prefix,
  suffix,
  ...textProps
}) => {
  const [displayCurrency, tooltipCurrency] = useMemo(() => {
    const tooltip = getCurrencyString(balance, decimals);
    const display = getDisplayCurrency(tooltip);

    return [display, tooltip];
  }, [balance, decimals]);

  return (
    <Tooltip label={tooltipCurrency}>
      <Text {...textProps}>
        {prefix}
        {displayCurrency}
        {suffix}
      </Text>
    </Tooltip>
  );
};
