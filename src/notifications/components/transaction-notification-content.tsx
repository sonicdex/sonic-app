import { Link } from '@chakra-ui/react';
import React from 'react';
import { NavLink } from 'react-router-dom';

export interface TransactionNotificationContentProps {
  transactionLink?: string;
}

export const TransactionNotificationContent: React.FC<
  TransactionNotificationContentProps
> = ({ transactionLink }) => {
  if (!transactionLink) return null;

  return (
    <Link as={NavLink} to={transactionLink} rel="noreferrer" color="dark-blue.500">
      View in activity tab
    </Link>
  );
};
