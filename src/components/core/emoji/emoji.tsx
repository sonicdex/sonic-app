import React from 'react';
import { chakra, forwardRef } from '@chakra-ui/system';

export type EmojiProps = {
  label: string;
  children: string;
};

export const Emoji: React.FC<EmojiProps> = forwardRef<EmojiProps, 'svg'>(
  ({ children, label }, ref) => {
    return (
      <chakra.span
        ref={ref}
        role="img"
        aria-label={label}
        title={label}
        fontSize="18px"
        ml="3px"
        mt="2px"
        transform="scale(1)"
      >
        {children}
      </chakra.span>
    );
  }
);
