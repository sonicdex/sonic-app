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
        paddingLeft="1.2px"
        paddingTop="1px"
        aria-label={label}
        title={label}
        fontSize="3px"
        transform="scale(6)"
      >
        {children}
      </chakra.span>
    );
  }
);
