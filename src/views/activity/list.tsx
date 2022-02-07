import { Skeleton, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React, { Fragment, useMemo } from 'react';

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
  LedgerTransactionActivity,
  LoadingActivity,
  RemoveLiquidityActivity,
  SwapActivity,
  WithdrawActivity,
} from './components';

export const ActivityListView = () => {
  useActivityView();
  const { isConnected } = usePlugStore();
  const { activityList, CAPstate, LedgerState, page, endReached } =
    useActivityViewStore();
  const dispatch = useAppDispatch();

  const color = useColorModeValue('gray.600', 'custom.1');

  const scrollHandler = (e: any): void => {
    if (endReached || CAPstate === FeatureState.Loading) return;
    const isBottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (isBottom) {
      dispatch(activityViewActions.setPage(page + 1));
    }
  };

  const isUpdating = useMemo(() => {
    return (
      CAPstate === FeatureState.Loading || LedgerState === FeatureState.Loading
    );
  }, [CAPstate, LedgerState]);

  if (!isConnected) {
    return (
      <>
        <Header title="Your Activity" />
        <PlugNotConnected message="Your transaction activity will appear here." />
      </>
    );
  }

  if (isUpdating && Object.keys(activityList).length === 0) {
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
          isUpdating={CAPstate === FeatureState.Loading}
        />
        <Text textAlign="center" color={color}>
          You have no activity
        </Text>
      </>
    );
  }

  return (
    <>
      <Header title="Your Activity" isUpdating={isUpdating} />
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
          {Object.entries(activityList)
            .sort(
              ([dateA], [dateB]) =>
                new Date(dateB).getTime() - new Date(dateA).getTime()
            )
            .map(([date, transactions], index) => (
              <Fragment key={index}>
                <Text>{new Date(date).toDateString()}</Text>
                {transactions.map((transaction, index) => {
                  if ('timestamp' in transaction) {
                    return (
                      <LedgerTransactionActivity key={index} {...transaction} />
                    );
                  }

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
