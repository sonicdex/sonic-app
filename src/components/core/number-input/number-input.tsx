import { Box } from '@chakra-ui/react';

type NumberInputProps = {
  value: string;
  setValue: (string) => any;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
};

export const NumberInput = ({
  value,
  setValue,
  placeholder = '0.00',
  disabled = false,
  style = {},
}: NumberInputProps) => {
  const handleValueChange = (response) => {
    const inputValue = response.target.value;
    const parsedInputValue = parseFloat(inputValue);

    if (isNaN(inputValue)) return;
    setValue(inputValue);
  };

  return (
    <Box
      as="input"
      type="text"
      bg="#1E1E1E"
      textAlign="right"
      fontSize="30px"
      fontWeight={700}
      color="#888E8F"
      outline="none"
      transition="color 400ms"
      _placeholder={{ color: '#888E8F' }}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={handleValueChange}
      style={style}
    />
  );
};
