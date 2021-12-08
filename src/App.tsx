import isMobile from 'ismobilejs';
import { Routes, Navigate, Route, BrowserRouter } from 'react-router-dom';

import { Activity, Assets, Liquidity, Swap, TestView } from '@/views';
import { NotificationManager } from '@/notifications';
import { ModalManager } from '@/modals';

import { EmptyMobile, Layout } from './components';
import { usePlugInit } from './integrations/plug';
import { useSwapInit } from './integrations/swap';
import { useActorsInit } from './integrations/actor/use-actors-init';
import { AssetsWithdraw } from './views/assets/views/withdraw';
import { AssetsDeposit } from './views/assets/views/deposit';

export const App = () => {
  const isAnyMobileDevice = isMobile(window.navigator).any;

  usePlugInit();
  useActorsInit();
  useSwapInit();

  // TODO: Remove after plug mobile connection
  if (isAnyMobileDevice) {
    return <EmptyMobile />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <NotificationManager />
        <ModalManager />
        <Routes>
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/withdraw" element={<AssetsWithdraw />} />
          <Route path="/assets/deposit" element={<AssetsDeposit />} />

          <Route path="/swap" element={<Swap />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/test" element={<TestView />} />
          <Route path="*" element={<Navigate to="/assets" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
