import { useMemo } from 'react';
import { infoSrc } from '@/assets';
import { swapViewActions, useAppDispatch, useSwapViewStore } from '@/store';
import {
  Checkbox,
  Flex,
  FormControl,
  Image,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';

type OperationType = 'swap' | 'wrap';

type KeepInSonicBoxProps = {
  symbol?: string;
  operation?: OperationType;
};

export const KeepInSonicBox: React.FC<KeepInSonicBoxProps> = ({
  symbol,
  operation = 'swap',
}) => {
  const { keepInSonic } = useSwapViewStore();
  const dispatch = useAppDispatch();

  const label = useMemo(() => {
    return `Keep ${symbol ? symbol : 'tokens'} in Sonic after ${operation}`;
  }, [operation, symbol]);

  return (
    <Flex
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      borderRadius="xl"
      bg="#1E1E1E"
      px={5}
      py={4}
      mb={5}
    >
      <FormControl direction="row" alignItems="center">
        <Checkbox
          isChecked={keepInSonic}
          onChange={(e) =>
            dispatch(swapViewActions.setKeepInSonic(e.target.checked))
          }
          colorScheme="dark-blue"
          size="lg"
          color={keepInSonic ? '#FFFFFF' : '#888E8F'}
          fontWeight={600}
        >
          {label}
        </Checkbox>
      </FormControl>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Image
            src={infoSrc}
            width={5}
            transition="opacity 200ms"
            opacity={keepInSonic ? 1 : 0.5}
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody display="inline-block">
              Keeping tokens in Sonic (instead of withdrawing to Plug) is good
              for high frequency trading where a few extra seconds matters a
              lot. By doing this you can skip the deposit step on your next
              trade and save the 2-3 extra seconds.&nbsp;
              <Link href="/#" color="#3D52F4">
                {/* TODO: add correct href */}
                Learn More
              </Link>
              .
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
};
