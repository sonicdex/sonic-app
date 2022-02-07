import { Link } from '@chakra-ui/react';
import React from 'react';

export interface TransactionNotificationContentProps {
  transactionLink?: string;
}

export const TransactionNotificationContent: React.FC<
  TransactionNotificationContentProps
> = ({ transactionLink }) => {
  if (!transactionLink) return null;

  return (
    <Link href={transactionLink} rel="noreferrer" color="dark-blue.500">
      View in activity tab
    </Link>
  );
};
