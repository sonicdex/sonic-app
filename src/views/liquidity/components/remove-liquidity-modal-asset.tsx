import { Image } from '@chakra-ui/image';
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { Price } from '@sonicdex/sonic-js';
import { FC, useMemo } from 'react'; //useEffect useState

import { questionMarkSrc } from '@/assets';
import { DisplayValue } from '@/components';
import { AppTokenMetadata } from '@/models';

type RemoveLiquidityModalAssetProps = Partial<AppTokenMetadata> & {
  balance: string;
  isUpdating?: boolean;
  onValueChange?: Function;
};

export const RemoveLiquidityModalAsset: FC<RemoveLiquidityModalAssetProps> = ({
  symbol,decimals,logo = questionMarkSrc,balance = 0,price = 0, isUpdating, onValueChange
}) => {

  // const [tokenBalance, setTokenBalance] = useState<number|string>();

  const balancePrice = useMemo(
    () => {return Price.getByAmount({ amount: String(balance), price }).toString()},
    [balance, price]
  );

 // useEffect(()=>{ setTokenBalance(Number(balance).toFixed(decimals) )},[balance])

  const bg = useColorModeValue('gray.100', 'gray.700');
  
  // const manageChange = (e: any) => {
  //   setTokenBalance(e.target.value);
  //   onValueChange?onValueChange(symbol, e.target.value):null;
  // }
  
  return (
    <Flex justifyContent="space-between">
      <HStack pl={2} py={2} pr={4} bg={bg} borderRadius="full" alignSelf="center">
        <Image src={logo} alt={symbol} boxSize={6} borderRadius="full" />
        <Text fontWeight="bold">{symbol}</Text>
      </HStack>
      <Box textAlign="end">
        <Box fontSize="xl" fontWeight="bold">
          {/* <Input w={'auto'} marginTop={2} value={tokenBalance}  type={'number'} onChange={manageChange}></Input> */}
          <DisplayValue value={balance} isUpdating={isUpdating} decimals={decimals}/>
        </Box>
        <Box fontSize="xs">
          <DisplayValue value={balancePrice} prefix="~$" isUpdating={isUpdating} />
        </Box>
      </Box>
    </Flex>
  );
};
