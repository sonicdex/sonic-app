import { Link } from '@chakra-ui/react';
import React from 'react';

export interface TransactionLinkProps {
  transactionLink?: string;
}

export const TransactionLink: React.FC<TransactionLinkProps> = ({
  transactionLink,
}) => {
  return (
    <Link href={transactionLink} rel="noreferrer" color="dark-gray.500">
      View in activity tab
    </Link>
  );
};
