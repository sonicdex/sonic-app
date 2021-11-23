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
  source: 'plug' | 'sonic',
  balance: '0.00',
  amount: '0.00',
  disabled?: boolean,
  status?: 'disabled' | 'active',
};

const ChevronDownIcon = () => (
  <Box as="img" src={chevronDownSrc} />
);

const TokenOption = ({ img, name }: Token) => (
  <Flex direction="row" width="fit-content" alignItems="center">
    <Box as="img" src={img} height="20px" />
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
  disabled=false,
}: TokenBoxProps) => {

  const sourceImg = source === 'plug' ? greyPlugSrc : greySonicSrc;

  return (
    <Box
      borderRadius={20}
      bg="#1E1E1E"
      border="1px solid #373737"
      pt="20px"
      px="20px"
      pb="17px"
      transition="border 400ms"
      _hover={{
        border: "1px solid #888E8F"
      }}
    >
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb="13px"
      >
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            borderRadius={20}
            py="9px"
            pl="10px"
            pr="12px"
          >
            <TokenOption img={currentToken.img} name={currentToken.name} />
          </MenuButton>
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
        </Menu>
        <NumberInput
          value={value}
          setValue={setValue}
          disabled={disabled}
          style={{
            color: status === 'active' ? '#F6FCFD' : '#888E8F',
          }}
        />
      </Flex>
      <Flex direction="row" justifyContent="space-between">
        <Flex direction="row">
          <Box as="img" src={sourceImg} mr="7px" height="20px" />
          <Box as="p" color="#888E8F" fontSize="16px">
            {`Balance: ${balance} ${currentToken.name}`}
          </Box>
        </Flex>
        <Box color={ status === 'active' ? '#F6FCFD' : '#888E8F' }
        >
          {`$${amount}`}
        </Box>
      </Flex>
    </Box>
  );
};
