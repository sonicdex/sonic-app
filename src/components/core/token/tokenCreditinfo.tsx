import { Flex } from '@chakra-ui/react';

export type TokenMetaProps = {
    tokenSymbol?: string;
    tokenValue?: string;
};

export const TokenDataMetaInfo: React.FC<TokenMetaProps> = ({
    tokenSymbol,
    tokenValue,
}) => {

    let isPrice = (): number => {
        var temp: number = tokenValue ? parseFloat(tokenValue) : 0;
        temp = temp * (89/100);
        return temp;
    };
    let calcPrice: number = isPrice()
    return (
        <Flex mt={2} className="sdsd">
            {calcPrice&&tokenSymbol=='YC' ? (
                <p>credited after 11% <a style={{ color: 'blue' }} href="https://blog.cigdao.com/cigdao-decentralization-sale-6856ad618f8c">YC tax</a>: {calcPrice}</p>
            ) : (
                ''
            )}
        </Flex>
    );
};