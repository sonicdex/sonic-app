import { ActorAdapter, Default } from '@memecake/sonic-js';
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

import { Layout } from './components';
import {
  AddLiquidityFailModal,
  AddLiquidityProgressModal,
  AllowanceVerifyModal,
  DepositProgressModal,
  MintManualModal,
  MintWICPFailModal,
  MintWICPProgressModal,
  MintXTCFailModal,
  MintXTCProgressModal,
  RemoveLiquidityFailModal,
  RemoveLiquidityProgressModal,
  SwapFailModal,
  SwapProgressModal,
  TermsAndConditionsModal,
  TokenSelectModal,
  WithdrawProgressModal,
  WithdrawWICPFailModal,
  WithdrawWICPProgressModal,
} from './components/modals';
import { ENV } from './config';
import {
  useNetworkErrorNotifications,
  useTokenLogosFetcherInit,
} from './hooks';
import { useBlockHeightsInit } from './hooks/use-block-heights-init';
import { usePlugInit } from './integrations/plug';
import {
  useCyclesMintingCanisterInit,
  useLiquidityViewInit,
  usePriceInit,
  useSwapCanisterInit,
} from './store';

ActorAdapter.DEFAULT_HOST = ENV.host;
Default.ENV = process.env.NODE_ENV || 'production';
Default.IC_HOST = ENV.host;

export const App = () => {
  useCyclesMintingCanisterInit();
  usePlugInit();
  usePriceInit();
  useSwapCanisterInit();
  useLiquidityViewInit();
  useBlockHeightsInit();
  useTokenLogosFetcherInit();
  useNetworkErrorNotifications();

  return (
    <BrowserRouter>
      <Layout>
        <NotificationManager />

        <TermsAndConditionsModal />
        <TokenSelectModal />
        <AllowanceVerifyModal />
        <MintManualModal />

        <SwapProgressModal />
        <SwapFailModal />

        <WithdrawProgressModal />

        <DepositProgressModal />

        <AddLiquidityProgressModal />
        <AddLiquidityFailModal />

        <RemoveLiquidityProgressModal />
        <RemoveLiquidityFailModal />

        <WithdrawWICPProgressModal />
        <WithdrawWICPFailModal />

        <MintXTCProgressModal />
        <MintXTCFailModal />

        <MintWICPProgressModal />
        <MintWICPFailModal />

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
