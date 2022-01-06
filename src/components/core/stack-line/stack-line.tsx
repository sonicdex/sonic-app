import { Flex, StackItem, Text } from '@chakra-ui/react';
import React from 'react';

export type StackLineProps = {
  title: string;
  value: string;
};

export const StackLine: React.FC<StackLineProps> = ({ value, title }) => {
  return (
    <StackItem>
      <Flex>
        <Text>{title}</Text>
        <Text ml={2} flex={1} textAlign="right">
          {value}
        </Text>
      </Flex>
    </StackItem>
  );
};
