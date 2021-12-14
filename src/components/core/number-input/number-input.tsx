import { Input } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

type NumberInputProps = {
  value: string;
  setValue: (value: string) => any;
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
  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // const parsedInputValue = parseFloat(inputValue);

    if (isNaN(Number(inputValue))) return;
    setValue(inputValue);
  };

  return (
    <Input
      variant="unstyled"
      type="text"
      bg="#1E1E1E"
      textAlign="right"
      fontSize="3xl"
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
