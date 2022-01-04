import { Text, TextProps, Tooltip } from '@chakra-ui/react';
import { useMemo } from 'react';

import { formatValue, getCurrencyString } from '@/utils/format';

export type DisplayValueProps = TextProps & {
  value?: number | string;
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
  const [formattedValue, tooltipLabel, isDisabled] = useMemo(() => {
    const tooltip = decimals ? getCurrencyString(value, decimals) : value;
    const display = formatValue(tooltip.toString());

    return [display, tooltip, String(tooltip).length <= 4];
  }, [value, decimals]);

  return (
    <Tooltip label={tooltipLabel} isDisabled={isDisabled}>
      <Text {...textProps}>
        {prefix}
        {formattedValue}
        {suffix}
      </Text>
    </Tooltip>
  );
};
