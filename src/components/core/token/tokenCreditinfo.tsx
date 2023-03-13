import { Flex,Text  } from '@chakra-ui/react';

export type TokenMetaProps = {
    tokenSymbol?: string;
    tokenValue?: string;
    fromSources?:any
};

export const TokenDataMetaInfo: React.FC<TokenMetaProps> = ({
    tokenSymbol,
    tokenValue,
    fromSources,
}) => {
    console.log('fromSources',fromSources)
    let isPrice = (): number => {
        var temp: number = tokenValue ? parseFloat(tokenValue) : 0;
        temp = parseFloat((temp * (89/100)).toFixed(3));
        return temp;
    };
    let calcPrice: number = isPrice()
    return (
        <Flex mt={2} className="">
            {calcPrice&&tokenSymbol=='YC' ? (
                <Text color="var(--chakra-colors-gray-200)" >
                    Credited after 11% 
                    <a style={{ color: 'var(--chakra-colors-blue-300)' }} target="_blank" 
                    href="https://blog.cigdao.com/cigdao-decentralization-sale-6856ad618f8c"> YC tax </a> : {calcPrice}
                </Text>
            ) : (
                ''
            )}
        </Flex>
    );
};