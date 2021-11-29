import { NumberInput } from '@/components';
import {
  chevronDownSrc,
  logoSrc,
  greySonicSrc,
  greyPlugSrc
} from '@/assets';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';

type Token = {
  img: string,
  name: string,
};

type TokenBoxProps = {
  value: string,
  setValue: (string) => any,
  onTokenSelect: (string) => any,
  tokenOptions: Array<Token>,
  currentToken: Token,
  balance: '0.00',
  amount: '0.00',
  source?: 'plug' | 'sonic' | null,
  balanceText?: string,
  menuDisabled?: boolean,
  disabled?: boolean,
  amountText?: string,
  status?: string,
  glow?: boolean,
};

const ChevronDownIcon = () => (
  <Box as="img" src={chevronDownSrc} />
);

const TokenOption = ({ img, name }: Token) => (
  <Flex direction="row" width="fit-content" alignItems="center">
    <Box as="img" src={img} height="25px" />
    <Box as="p" fontWeight={700} color="#F6FCFD" ml="7px">
      {name}
    </Box>
  </Flex>
);

export const TokenBox = ({
  status,
  value,
  setValue,
  onTokenSelect,
  tokenOptions,
  currentToken,
  source,
  balance,
  amount,
  balanceText,
  amountText,
  menuDisabled=false,
  disabled=false,
  glow=false,
}: TokenBoxProps) => {

  const sourceImg = source === 'plug' ? greyPlugSrc : greySonicSrc;

  const border = glow ? '1px solid #3D52F4' : '1px solid #373737';
  const background = glow ? '#151515' : '#1E1E1E';

  const balanceDisplay = balanceText ?
    balanceText :
    `Balance: ${balance} ${currentToken.name}`;

  const amountDisplay = amountText ?
    amountText :
    `$${amount}`;

  return (
    <Box
      borderRadius={20}
      bg={background}
      border={border}
      pt="20px"
      px="20px"
      pb="17px"
      transition="border 400ms"
      position="relative"
      _hover={{
        border
      }}
    >
      { glow && (
        <Box position="absolute"
          borderRadius={20}
          top="0px"
          left="0px"
          width="100%"
          height="100%"
          filter="blur(6px)"
          zIndex={-100}
          bg="#3D52F4"
        />
      )}
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb="13px"
      >
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={ !menuDisabled ? (<ChevronDownIcon />) : null }
            borderRadius={20}
            py="9px"
            pl="10px"
            pr="12px"
          >
            <TokenOption img={currentToken.img} name={currentToken.name} />
          </MenuButton>
          { !menuDisabled && (
            <MenuList>
              { tokenOptions.map((token) => (
                <MenuItem key={token.name} onClick={() => onTokenSelect(token.name)}>
                  <TokenOption
                    img={token.img}
                    name={token.name}
                  />
                </MenuItem>
              ))}
            </MenuList>
          )}
        </Menu>
        <NumberInput
          value={value}
          setValue={setValue}
          disabled={disabled}
          style={{
            color: status === 'active' ? '#F6FCFD' : '#888E8F',
            background
          }}
        />
      </Flex>
      <Flex direction="row" justifyContent="space-between">
        <Flex direction="row">
          { source && (
            <Box as="img" src={sourceImg} mr="7px" height="20px" />
          )}
          <Box as="p" color="#888E8F" fontSize="16px">
            {balanceDisplay}
          </Box>
        </Flex>
        <Box transition="color 400ms" color={ status === 'active' ? '#F6FCFD' : '#888E8F' }>
          {amountDisplay}
        </Box>
      </Flex>
    </Box>
  );
};
