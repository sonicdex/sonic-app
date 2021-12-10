import { ModalManager } from '@/modals';
import { NotificationManager } from '@/notifications';
import { Activity, Assets, Liquidity, LiquidityAdd, Swap } from '@/views';
import isMobile from 'ismobilejs';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { EmptyMobile, Layout } from './components';
import { useActorsInit } from './integrations/actor/use-actors-init';
import { usePlugInit } from './integrations/plug';
import { AssetsDeposit } from './views/assets/views/deposit';
import { AssetsWithdraw } from './views/assets/views/withdraw';

export const App = () => {
  const isAnyMobileDevice = isMobile(window.navigator).any;

  usePlugInit();
  useActorsInit();

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
