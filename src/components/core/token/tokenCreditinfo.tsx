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
        temp = temp / 10;
        return temp;
    };
    let calcPrice: number = isPrice()
    return (
        <Flex mt={2} className="sdsd">
            {calcPrice&&tokenSymbol=='YC' ? (
                <p>This is calcuated by a funtion {calcPrice}</p>
            ) : (
                ''
            )}
        </Flex>
    );
};