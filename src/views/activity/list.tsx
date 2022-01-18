import { Skeleton, Stack, Text } from '@chakra-ui/react';
import React, { Fragment } from 'react';

import { Header, PlugNotConnected } from '@/components';
import {
  activityViewActions,
  FeatureState,
  useActivityView,
  useActivityViewStore,
  useAppDispatch,
  usePlugStore,
} from '@/store';

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
        <PlugNotConnected message="Your transaction activity will appear here." />
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
        <Text textAlign="center" color="custom.1">
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
      <Stack mt={-5} mb={-5} spacing={4} overflowX="hidden" position="relative">
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
                const renderActivity = (
                  Activity: React.FC<any>
                ): JSX.Element => (
                  <Activity
                    key={index}
                    {...transaction.details}
                    time={transaction.time}
                  />
                );
                switch (transaction.operation) {
                  case 'swap':
                    return renderActivity(SwapActivity);
                  case 'addLiquidity':
                    return renderActivity(AddLiquidityActivity);
                  case 'removeLiquidity':
                    return renderActivity(RemoveLiquidityActivity);
                  case 'withdraw':
                    return renderActivity(WithdrawActivity);
                  case 'deposit':
                    return renderActivity(DepositActivity);
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
