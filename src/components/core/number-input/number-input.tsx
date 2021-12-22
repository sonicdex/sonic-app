import { Input, InputProps } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

export type NumberInputProps = InputProps & {
  setValue?: (value: string) => void;
  placeholder?: string;
};

export const NumberInput = ({
  placeholder = '0.00',
  setValue,
  ...props
}: NumberInputProps) => {
  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (isNaN(Number(value))) return;

    if (setValue) {
      setValue(value);
    }
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
