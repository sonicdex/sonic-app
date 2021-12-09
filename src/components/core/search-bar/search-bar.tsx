import { ChangeEvent } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

import { searchSrc } from '@/assets';

type SearchBarProps = {
  search: string;
  setSearch: (arg0: string) => any;
};

export const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setSearch(inputValue);
  };

  return (
    <Flex
      boxSizing="border-box"
      px="16px"
      mb="15px"
      bg="#282828"
      w="100%"
      h="42px"
      borderRadius={20}
    >
      <Image src={searchSrc} w="16px" mr={3} />
      <Box
        as="input"
        value={search}
        bg="#282828"
        border="none"
        w="100%"
        color="#F6FCFD"
        outline="none"
        fontWeight={400}
        placeholder="Search by name or canister id"
        onChange={handleSearchChange}
        _placeholder={{
          color: '#888E8F',
        }}
      />
    </Flex>
  );
};
