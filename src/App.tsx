import isMobile from 'ismobilejs';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { NotificationManager } from '@/notifications';
import {
  ActivityListView,
  AssetsDepositView,
  AssetsListView,
  AssetsWithdrawView,
  LiquidityAddView,
  LiquidityListView,
  SwapView,
} from '@/views';

import { EmptyMobile, Layout } from './components';
import {
  AddLiquidityFailModal,
  AddLiquidityProgressModal,
  AllowanceVerifyModal,
  DepositProgressModal,
  RemoveLiquidityFailModal,
  RemoveLiquidityModal,
  RemoveLiquidityProgressModal,
  SwapFailModal,
  SwapProgressModal,
  TokenSelectModal,
  UnwrapProgressModal,
  WithdrawProgressModal,
  WrapProgressModal,
} from './components/modals';
import { usePlugInit } from './integrations/plug';
import {
  useLiquidityViewInit,
  usePriceInit,
  useSwapCanisterInit,
} from './store';

export const App = () => {
  const isAnyMobileDevice = isMobile(window.navigator).any;

  usePlugInit();
  usePriceInit();
  useSwapCanisterInit();
  useLiquidityViewInit();

  // TODO: Remove after plug mobile connection
  if (isAnyMobileDevice) {
    return <EmptyMobile />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <NotificationManager />

        <RemoveLiquidityModal />
        <SwapProgressModal />
        <TokenSelectModal />
        <WithdrawProgressModal />
        <DepositProgressModal />
        <AddLiquidityProgressModal />
        <RemoveLiquidityProgressModal />
        <UnwrapProgressModal />
        <WrapProgressModal />

        <SwapFailModal />
        <AddLiquidityFailModal />
        <RemoveLiquidityFailModal />

        <AllowanceVerifyModal />

        <Routes>
          <Route path="/swap" element={<SwapView />} />

          <Route path="/assets" element={<AssetsListView />} />
          <Route path="/assets/withdraw" element={<AssetsWithdrawView />} />
          <Route path="/assets/deposit" element={<AssetsDepositView />} />

          <Route path="/liquidity" element={<LiquidityListView />} />
          <Route path="/liquidity/add" element={<LiquidityAddView />} />

          <Route path="/activity" element={<ActivityListView />} />
          <Route path="*" element={<Navigate to="/swap" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
