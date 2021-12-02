import isMobile from 'ismobilejs';
import { Routes, Navigate, Route, BrowserRouter } from 'react-router-dom';

import { Activity, Assets, Liquidity, Swap, TestView } from '@/views';

import { EmptyMobile, Layout } from './components';
import { usePlugInit } from './integrations/plug';

import { useActorsInit } from './integrations/actor/use-actors-init';

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
        <Routes>
          <Route path="/assets" element={<Assets />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="*" element={<Navigate to="/swap" />} />
          <Route path="/test" element={<TestView />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
