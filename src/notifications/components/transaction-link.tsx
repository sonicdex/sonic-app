import { Link } from '@chakra-ui/react';
import React from 'react';

export interface TransactionLinkProps {
  transactionLink?: string;
}

export const TransactionLink: React.FC<TransactionLinkProps> = ({
  transactionLink,
}) => {
  return (
    <Link
      href={transactionLink}
      target="_blank"
      rel="noreferrer"
      color="#3D52F4"
    >
      View on explorer
    </Link>
  );
};
