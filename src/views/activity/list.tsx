import {
  Alert,
  AlertIcon,
  AlertTitle,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Fragment } from 'react';

import { Header, PlugButton } from '@/components';
import {
  activityViewActions,
  FeatureState,
  useActivityView,
  useActivityViewStore,
  useAppDispatch,
  usePlugStore,
} from '@/store';
import { theme } from '@/theme';

import {
  AddLiquidityActivity,
  DepositActivity,
  LoadingActivity,
  RemoveLiquidityActivity,
  SwapActivity,
  WithdrawActivity,
} from './components';

export const ActivityListView = () => {
  useActivityView();
  const { isConnected } = usePlugStore();
  const { activityList, state, page, endReached } = useActivityViewStore();
  const dispatch = useAppDispatch();

  const scrollHandler = (e: any): void => {
    if (endReached || state === FeatureState.Loading) return;
    const isBottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (isBottom) {
      dispatch(activityViewActions.setPage(page + 1));
    }
  };

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
        <Skeleton mb={2} h={4} w={40} />
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
          isRefreshing={state === FeatureState.Loading}
        />
        <Text textAlign="center" color="#888E8F">
          You have no activity
        </Text>
      </>
    );
  }

  return (
    <>
      <Header
        title="Your Activity"
        isRefreshing={state === FeatureState.Loading}
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
        <Stack
          overflowX="auto"
          pb={20}
          pt={5}
          onScroll={scrollHandler}
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '&::-webkit-scrollbar-track': {
              display: 'none',
            },
            '&::-webkit-scrollbar-thumb': {
              display: 'none',
            },
          }}
        >
          {Object.entries(activityList).map(([date, transactions], index) => (
            <Fragment key={index}>
              <Text>{new Date(date).toDateString()}</Text>
              {transactions.map((transaction, index) => {
                switch (transaction.operation) {
                  case 'swap':
                    return (
                      <SwapActivity
                        key={index}
                        {...(transaction.details as any)}
                        time={transaction.time}
                      />
                    );
                  case 'addLiquidity':
                    return (
                      <AddLiquidityActivity
                        key={index}
                        {...(transaction.details as any)}
                        time={transaction.time}
                      />
                    );
                  case 'removeLiquidity':
                    return (
                      <RemoveLiquidityActivity
                        key={index}
                        {...(transaction.details as any)}
                        time={transaction.time}
                      />
                    );
                  case 'withdraw':
                    return (
                      <WithdrawActivity
                        key={index}
                        {...(transaction.details as any)}
                        time={transaction.time}
                      />
                    );
                  case 'deposit':
                    return (
                      <DepositActivity
                        key={index}
                        {...(transaction.details as any)}
                        time={transaction.time}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </Fragment>
          ))}
        </Stack>
      </Stack>
    </>
  );
};
