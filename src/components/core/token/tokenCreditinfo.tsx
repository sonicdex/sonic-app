import { Flex,Text  } from '@chakra-ui/react';
import { useTokenTaxCheck } from '@/hooks'

export type TokenMetaProps = {
    tokenSymbol?: string;
    tokenDecimals?: number;
    tokenValue?: string;
    tokenId?: string;
    pageInfo?:string;
};

export const TokenDataMetaInfo: React.FC<TokenMetaProps> = ({
    tokenSymbol,
    tokenValue,
    tokenDecimals,
    tokenId,
    pageInfo,
}) => {
    var info = useTokenTaxCheck({tokenId ,tokenSymbol, tokenDecimals, tokenValue});
    let isPrice = (): number => {
        return parseFloat(info.taxInfo.netValue.toFixed(3));
    };
    let calcPrice: number = isPrice();

    return (
        <Flex mt={2} className="">
            {calcPrice&&tokenSymbol=='YC' ? (
                <Text color="var(--chakra-colors-gray-200)" >
                    { pageInfo == "swap" ? "Swapping for after 11% ": "Credited after 11%" }
                    <a style={{ color: 'var(--chakra-colors-blue-300)' }} target="_blank" 
                    href="https://blog.cigdao.com/cigdao-decentralization-sale-6856ad618f8c"> YC tax </a> : {calcPrice}
                </Text>
            ) : (
                ''
            )}
        </Flex>
    );
};