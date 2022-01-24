import {
  forwardRef,
  Input,
  InputProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';

export type NumberInputProps = InputProps & {
  setValue?: (value: string) => void;
  placeholder?: string;
};

export const NumberInput = forwardRef<NumberInputProps, 'input'>(
  ({ placeholder = '0.00', setValue, ...props }, ref) => {
    const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (isNaN(Number(value))) return;

      if (setValue) {
        setValue(value);
      }
    };

    const color = useColorModeValue('gray.500', 'gray.300');

    return (
      <Input
        ref={ref}
        variant="unstyled"
        type="text"
        textAlign="right"
        fontSize="3xl"
        fontWeight={700}
        backgroundColor="transparent"
        color={color}
        outline="none"
        transition="color 400ms"
        onChange={handleValueChange}
        placeholder={placeholder}
        _placeholder={{ color: color }}
        {...props}
      />
    );
  }
);
