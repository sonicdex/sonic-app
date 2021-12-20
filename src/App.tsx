import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import isMobile from 'ismobilejs';

import { NotificationManager } from '@/notifications';
import { Activity, Assets, Liquidity, LiquidityAdd, Swap } from '@/views';

import { EmptyMobile, Layout } from './components';
import {
  AddLiquidityProgressModal,
  SwapFailModal,
  SwapProgressModal,
  TokenSelectModal,
} from './components/modals';
import { useActorsInit } from './integrations/actor/use-actors-init';
import { usePlugInit } from './integrations/plug';
import { AssetsDeposit } from './views/assets/views/deposit';
import { AssetsWithdraw } from './views/assets/views/withdraw';
import { WithdrawProgressModal } from './components/modals/withdraw-modal';
import { DepositProgressModal } from './components/modals/deposit-modal';
import { useLiquidityViewInit, useSwapCanisterInit } from './store';

export const App = () => {
  const isAnyMobileDevice = isMobile(window.navigator).any;

  usePlugInit();
  useActorsInit();
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

        <SwapProgressModal />
        <SwapFailModal />
        <TokenSelectModal />
        <WithdrawProgressModal />
        <DepositProgressModal />
        <AddLiquidityProgressModal />

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
