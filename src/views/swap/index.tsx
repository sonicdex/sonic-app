import { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { infoSrc, arrowDownSrc } from '@/assets';
import { useAppSelector, selectPlugState } from '@/store';
import { TitleBox, Toggle, TokenBox, Button } from '@/components';

// Mocked values
const tokenOptions = {
  'XMPL': {
    img: infoSrc,
    name: 'XMPL',
  },
  'XMP2': {
    img: infoSrc,
    name: 'XMP2',
  },
  'XMP3': {
    img: infoSrc,
    name: 'XMP3',
  },
};

export const Swap = () => {
  const { isConnected } = useAppSelector(selectPlugState);
  const [lazySwap, setLazySwap] = useState(true);
  const [fromValue, setFromValue] = useState('0.00');
  const [fromToken, setFromToken] = useState(Object.values(tokenOptions)[0]);
  const [toValue, setToValue] = useState('0.00');
  const [toToken, setToToken] = useState(Object.values(tokenOptions)[1]);

  const handleTokenSelect = (tokenName, setter) => {
    setter(tokenOptions[tokenName]);
  };

  const source = lazySwap ? 'plug' : 'sonic';
  const buttonTitle = isConnected ? 'Review Swap' : 'Connect to Plug';

  return (
    <>
      <TitleBox title="Swap" settings="sd">
        <Flex direction="row" justifyContent="space-between" alignItems="center">
          <Flex
            fontWeight={700}
            fontSize="16px"
            as="h4"
            direction="row"
          >
            Lazy Swap
            <Box
              ml="7px"
              as="img"
              src={infoSrc}
            />
          </Flex>
          <Toggle toggle={lazySwap} onToggle={() => setLazySwap(!lazySwap)} />
        </Flex>
      </TitleBox>
      <Flex direction="column" alignItems="center" mb="20px">
        <Box mt="20px" width="100%">
          <TokenBox
            value={fromValue}
            setValue={setFromValue}
            onTokenSelect={(tokenName) => handleTokenSelect(tokenName, setFromToken)}
            tokenOptions={Object.values(tokenOptions)}
            currentToken={fromToken}
            source={source}
            balance="0.00"
            amount="0.00"
          />
        </Box>
        <Box
          borderRadius="15px"
          width="42px"
          height="42px"
          border="1px solid #373737"
          py="12px"
          px="13px"
          bg="#1E1E1E"
          mt="-16px"
          mb="-26px"
          zIndex={1200}
        >
          <Box as="img" m="auto" src={arrowDownSrc} />
        </Box>
        <Box mt="10px" width="100%">
          <TokenBox
            value={toValue}
            setValue={setToValue}
            onTokenSelect={(tokenName) => handleTokenSelect(tokenName, setToToken)}
            tokenOptions={Object.values(tokenOptions)}
            currentToken={toToken}
            disabled={true}
            source={source}
            balance="0.00"
            amount="0.00"
          />
        </Box>
      </Flex>
      <Button
        onClick={() => console.log('Handle onClick')}
        title={buttonTitle}
        fontWeight={700}
        fontSize={22}
        borderRadius={20}
        disabled={!isConnected}
      />
    </>
  );
};
