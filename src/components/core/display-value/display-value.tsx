import { getCurrencyString, formatValue } from '@/utils/format';
import { Text, TextProps, Tooltip } from '@chakra-ui/react';
import { useMemo } from 'react';

export type DisplayValueProps = TextProps & {
  value?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

export const DisplayValue: React.FC<DisplayValueProps> = ({
  value = 0,
  decimals,
  prefix,
  suffix,
  ...textProps
}) => {
  const [formattedValue, tooltipLabel] = useMemo(() => {
    const tooltip = decimals ? getCurrencyString(value, decimals) : value;
    const display = formatValue(tooltip.toString());

    return [display, tooltip];
  }, [value, decimals]);

  if (formattedValue === '0') {
    return (
      <Text {...textProps}>
        {prefix}
        {formattedValue}
        {suffix}
      </Text>
    );
  }

  return (
    <Tooltip label={tooltipLabel}>
      <Text {...textProps}>
        {prefix}
        {formattedValue}
        {suffix}
      </Text>
    </Tooltip>
  );
};
