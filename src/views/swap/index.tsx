import { useState } from 'react';
import { infoSrc } from '@/assets';
import { Box, Flex } from '@chakra-ui/react';
import { TitleBox, Toggle, TokenBox } from '@/components';

// Mocked value
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
  const [toggle, setToggle] = useState(true);
  const [fromValue, setFromValue] = useState('0.00');
  const [fromToken, setFromToken] = useState(Object.values(tokenOptions)[0]);

  const handleTokenSelect = (tokenName) => {
    setFromToken(tokenOptions[tokenName]);
  };

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
          <Toggle toggle={toggle} onToggle={() => setToggle(!toggle)} />
        </Flex>
      </TitleBox>
      <Box mt="20px">
        <TokenBox
          value={fromValue}
          handleValueChange={(e) => {
            console.log(e);
            setFromValue(e.target.value);
          }}
          onTokenSelect={handleTokenSelect}
          tokenOptions={Object.values(tokenOptions)}
          currentToken={fromToken}
          source="plug"
          balance="0.00"
          amount="0.00"
        />
      </Box>
    </>
  );
};
