import {
  Checkbox,
  Flex,
  FormControl,
  Icon,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';
import { useMemo } from 'react';

import { swapViewActions, useAppDispatch, useSwapViewStore } from '@/store';

export enum OperationType {
  Swap = 'swap',
  Wrap = 'wrap',
  Mint = 'mint',
}

type KeepInSonicBoxProps = {
  symbol?: string;
  operation?: OperationType;
  canHeldInSonic?: boolean;
};

const KEEP_IN_SONIC_LINK =
  'https://docs.sonic.ooo/product/assets#keeping-assets-in-sonic-after-a-swap';

export const KeepInSonicBox: React.FC<KeepInSonicBoxProps> = ({
  symbol,
  operation = 'swap',
  canHeldInSonic = true,
}) => {
  const { keepInSonic } = useSwapViewStore();
  const dispatch = useAppDispatch();

  const linkColor = useColorModeValue('green.300', 'green.500');
  const bg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('base', 'none');

  const checkboxColorKeepInSonic = useColorModeValue('black', 'white');
  const checkboxColorNotKeepInSonic = useColorModeValue('gray.600', 'custom.1');
  const checkboxColor = keepInSonic ? checkboxColorKeepInSonic : checkboxColorNotKeepInSonic;

  const { label, popoverLabel } = useMemo(() => {
    switch (operation) {
      case 'swap':
        return {
          label: `Keep ${symbol ? symbol : 'tokens'
            } in Sonic after ${operation}`,
          popoverLabel: (
            <>
              Keeping tokens in Sonic (instead of withdrawing to Plug) is good
              for high frequency trading where a few extra seconds matter a lot.
              By doing this, you can skip the deposit step on your next trades
              and save 2-3 seconds each time.&nbsp;
              <Link href={KEEP_IN_SONIC_LINK} color={linkColor}>
                Learn More
              </Link>
              .
            </>
          ),
        };
      case 'mint':
      case 'wrap':
        return {
          label: `Deposit ${symbol ? symbol : 'tokens'
            } to Sonic after ${operation}`,
          popoverLabel: (
            <>
              If you keep your tokens deposited in Sonic (instead of withdrawing
              to Plug) you can start swaps or add liquidity faster on your next
              operation. &nbsp;
              <Link href={KEEP_IN_SONIC_LINK} color={linkColor}>
                Learn More
              </Link>
              .
            </>
          ),
        };
      default:
        return {
          label: 'Keep in Sonic',
          popoverLabel: 'Keep in Sonic',
        };
    }
  }, [operation, symbol]);

  return (
    <Flex
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      borderRadius="xl"
      bg={bg}
      shadow={shadow}
      px={5}
      py={4}
      mb={5}
    >
      {canHeldInSonic ? (
        <>
          <FormControl dir="row" alignItems="center">
            <Checkbox
              isChecked={keepInSonic}
              onChange={(e) =>
                dispatch(swapViewActions.setKeepInSonic(e.target.checked))
              }
              colorScheme="green"
              color={checkboxColor}
              fontWeight={600}
            >
              {label}
            </Checkbox>
          </FormControl>
          <Popover trigger="hover">
            <PopoverTrigger>
              <Flex>
                <Icon
                  as={FaInfoCircle}
                  width={5}
                  transition="opacity 200ms"
                  opacity={keepInSonic ? 1 : 0.5}
                />
              </Flex>
            </PopoverTrigger>
            <Portal>
              <PopoverContent bg="custom.2">
                <PopoverBody display="inline-block">{popoverLabel}</PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </>
      ) : (
        <Text fontWeight="bold" color="gray.400">
          {symbol} can't be held in the Sonic canister
        </Text>
      )}
    </Flex>
  );
};
