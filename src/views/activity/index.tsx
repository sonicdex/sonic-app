import { Header, PlugButton } from '@/components';
import { useActivityView, useActivityViewStore, usePlugStore } from '@/store';
import { Alert, AlertIcon, AlertTitle, Stack, Text } from '@chakra-ui/react';
import {
  AddLiquidityActivity,
  DepositActivity,
  SwapActivity,
  WithdrawActivity,
} from './components';
export const Activity = () => {
  useActivityView();
  const { isConnected } = usePlugStore();
  const { activityList } = useActivityViewStore();

  if (!isConnected) {
    return (
      <>
        <Header title="Your Activity" />
        <Alert status="warning" mb={6}>
          <AlertIcon />
          <AlertTitle>You are not connected to the wallet</AlertTitle>
        </Alert>

        <PlugButton />
      </>
    );
  }

  if (Object.keys(activityList).length === 0) {
    return (
      <>
        <Header title="Your Activity" />
        <Text>Nothing to show</Text>
      </>
    );
  }

  return (
    <>
      <Header title="Your Activity" />
      <Stack spacing={4}>
        <Stack>
          {Object.entries(activityList).map(([date, transactions]) => (
            <>
              <Text>{new Date(date).toDateString()}</Text>
              {transactions.map((transaction) => {
                switch (transaction.operation) {
                  case 'swap':
                    return (
                      <SwapActivity
                        {...(transaction.details as any)}
                        time={transaction.time}
                      />
                    );
                  case 'addLiquidity':
                    return (
                      <AddLiquidityActivity
                        {...(transaction.details as any)}
                        time={transaction.time}
                      />
                    );

                  case 'withdraw':
                    return (
                      <WithdrawActivity
                        {...(transaction.details as any)}
                        time={transaction.time}
                      />
                    );
                  case 'deposit':
                    return (
                      <DepositActivity
                        {...(transaction.details as any)}
                        time={transaction.time}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </>
          ))}
        </Stack>
      </Stack>
    </>
  );
};
