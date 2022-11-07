import {
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight';
import { FaLink } from '@react-icons/all-files/fa/FaLink';
import { useMemo } from 'react';

import { SwapTokenData, useSwapViewStore } from '@/store';

export interface ChainPopoverProps {
  from: SwapTokenData;
  to: SwapTokenData;
}

export const ChainPopover: React.FC<ChainPopoverProps> = ({ from, to }) => {
  const { tokenList } = useSwapViewStore();
  const [path, isChained] = useMemo(() => {
    if (to.metadata) {
      const path = from.paths[to.metadata.id];
      return [path, path?.path?.length > 2];
    }
    return [];
  }, [from, to]);

  const bg = useColorModeValue('gray.200', 'gray.700');

  if (!path || !tokenList || !isChained)
    return (
      <Flex justifyContent="center" alignItems="center">
        {from.metadata?.symbol}
        &nbsp;
        <FaArrowRight />
        &nbsp;
        {to.metadata?.symbol}
      </Flex>
    );

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Flex justifyContent="center" alignItems="center">
          {from.metadata?.symbol}
          &nbsp;
          <FaLink />
          &nbsp;
          {to.metadata?.symbol}
        </Flex>
      </PopoverTrigger>

      <PopoverContent width="320px" minWidth="fit-content">
        <PopoverArrow />
        <PopoverBody>
          <Flex width="full" justifyContent="space-between" alignItems="center">
            {path.path.map((item, index) => (
              <>
                <Flex
                  px={2}
                  py={1}
                  borderRadius={4}
                  backgroundColor={bg}
                  fontSize="0.75rem"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image src={tokenList[item].logo} width={3} mr={1} />
                  {tokenList[item].symbol}
                </Flex>

                {index !== path.path.length - 1 && (
                  <FaArrowRight size={12} style={{ margin: '0 5px' }} />
                )}
              </>
            ))}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
