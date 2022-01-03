import isMobile from 'ismobilejs';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { NotificationManager } from '@/notifications';
import { Activity, Assets, Liquidity, LiquidityAdd, Swap } from '@/views';

import { EmptyMobile, Layout } from './components';
import {
  AddLiquidityFailModal,
  AddLiquidityProgressModal,
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
import { AssetsDeposit } from './views/assets/views/deposit';
import { AssetsWithdraw } from './views/assets/views/withdraw';

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

        <Routes>
          <Route path="/swap" element={<Swap />} />

          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/withdraw" element={<AssetsWithdraw />} />
          <Route path="/assets/deposit" element={<AssetsDeposit />} />

          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/liquidity/add" element={<LiquidityAdd />} />

          <Route path="/activity" element={<Activity />} />
          <Route path="*" element={<Navigate to="/swap" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
