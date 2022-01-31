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
  MintXTCFailModal,
  MintXTCProgressModal,
  RemoveLiquidityFailModal,
  RemoveLiquidityModal,
  RemoveLiquidityProgressModal,
  RetryTransactionModal,
  SwapFailModal,
  SwapProgressModal,
  TermsAndConditionsModal,
  TokenSelectModal,
  UnwrapFailModal,
  UnwrapProgressModal,
  WithdrawProgressModal,
  WrapFailModal,
  WrapProgressModal,
} from './components/modals';
import { useTokenLogos } from './hooks';
import { useBlockHeightsEffect } from './hooks/use-block-heights-effect';
import { usePlugInit } from './integrations/plug';
import {
  useCyclesMintingCanisterInit,
  useLiquidityViewInit,
  usePriceInit,
  useSwapCanisterInit,
} from './store';

export const App = () => {
  const isAnyMobileDevice = isMobile(window.navigator).any;

  useCyclesMintingCanisterInit();
  usePlugInit();
  usePriceInit();
  useSwapCanisterInit();
  useLiquidityViewInit();
  useTokenLogos();

  useBlockHeightsEffect();

  if (isAnyMobileDevice) {
    return <EmptyMobile />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <NotificationManager />

        <TermsAndConditionsModal />
        <RemoveLiquidityModal />
        <TokenSelectModal />
        <AllowanceVerifyModal />
        <RetryTransactionModal />

        <SwapProgressModal />
        <SwapFailModal />

        <WithdrawProgressModal />

        <DepositProgressModal />

        <AddLiquidityProgressModal />
        <AddLiquidityFailModal />

        <RemoveLiquidityProgressModal />
        <RemoveLiquidityFailModal />

        <UnwrapProgressModal />
        <UnwrapFailModal />

        <MintXTCProgressModal />
        <MintXTCFailModal />

        <WrapProgressModal />
        <WrapFailModal />

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
