import { Header, PlugButton } from '@/components';
import {
  FeatureState,
  useActivityView,
  useActivityViewStore,
  usePlugStore,
} from '@/store';
import { theme } from '@/theme';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  AddLiquidityActivity,
  DepositActivity,
  SwapActivity,
  WithdrawActivity,
} from './components';
import { LoadingActivity } from './components/loading-activity';
export const Activity = () => {
  useActivityView();
  const { isConnected } = usePlugStore();
  const { activityList, state } = useActivityViewStore();

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

  if (
    state === FeatureState.Loading &&
    Object.keys(activityList).length === 0
  ) {
    return (
      <>
        <Header title="Your Activity" />
        <Skeleton mb={2}>{new Date().toDateString()}</Skeleton>
        <LoadingActivity />
        <LoadingActivity />
      </>
    );
  }

  if (Object.keys(activityList).length === 0) {
    return (
      <>
        <Header
          title="Your Activity"
          isLoading={state === FeatureState.Loading}
        />
        <Text>Nothing to show</Text>
      </>
    );
  }

  return (
    <>
      <Header
        title="Your Activity"
        isLoading={state === FeatureState.Loading}
      />
      <Stack
        mt={-5}
        mb={-5}
        spacing={4}
        overflowX="hidden"
        position="relative"
        _after={{
          content: "''",
          position: 'absolute',
          height: 20,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.bg} 100%)`,
        }}
      >
        <Stack overflowX="auto" pb={20} pt={5}>
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
