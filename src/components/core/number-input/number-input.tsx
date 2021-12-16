import { Input, InputProps } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

type NumberInputProps = InputProps & {
  setValue: (value: string) => any;
  placeholder?: string;
};

export const NumberInput = ({
  setValue,
  placeholder = '0.00',
  ...props
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
      onChange={handleValueChange}
      placeholder={placeholder}
      _placeholder={{ color: '#888E8F' }}
      {...props}
    />
  );
};
