import NumberFormat from 'react-number-format';

type NumberInputProps = {
  value: string;
  setValue: (string) => any;
  decimalPoints?: number;
  fixedDecimalPoints?: boolean;
  placeholder?: string;
  allowNegative?: boolean;
  disabled?: boolean;
  style?: any;
};

export const NumberInput = ({
  value,
  setValue,
  decimalPoints = 5,
  fixedDecimalPoints = true,
  placeholder = '0.00000',
  allowNegative = false,
  disabled = false,
  style = {},
}: NumberInputProps) => {
  const handleValueChange = (response) => {
    setValue(response.formattedValue);
  };

  const isAllowed = (response) => {
    return response.formattedValue.length > 0;
  };

  return (
    <NumberFormat
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onValueChange={handleValueChange}
      decimalScale={decimalPoints}
      fixedDecimalScale={fixedDecimalPoints}
      thousandSeparator=","
      allowNegative={allowNegative}
      isAllowed={isAllowed}
      isNumericString
      style={{
        color: status === 'active' ? '#F6FCFD' : '#888E8F',
        background: '#1E1E1E',
        outline: 'none',
        fontSize: '30px',
        fontWeight: 700,
        border: 'none',
        textAlign: 'right',
        transition: 'color 400ms',
        ...style,
      }}
    />
  );
};
