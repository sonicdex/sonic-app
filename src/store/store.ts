import { configureStore } from '@reduxjs/toolkit';

import activityViewReducer from '@/store/features/activity-view/activity-view-slice';
import assetsViewReducer from '@/store/features/assets-view/assets-view-slice';
import cyclesMintingCanisterReducer from '@/store/features/cycles-minting-canister/cycles-minting-canister-slice';
import depositViewReducer from '@/store/features/deposit-view/deposit-view-slice';
import keepSyncReducer from '@/store/features/keep-sync/keep-sync-slice';
import liquidityViewReducer from '@/store/features/liquidity-view/liquidity-view-slice';
import modalsReducer from '@/store/features/modals/modals-slice';
import notificationReducer from '@/store/features/notification/notification-slice';
import plugReducer from '@/store/features/plug/plug-slice';
import priceReducer from '@/store/features/price/price-slice';
import swapReducer from '@/store/features/swap-canister/swap-canister-slice';
import swapViewReducer from '@/store/features/swap-view/swap-view-slice';
import withdrawViewReducer from '@/store/features/withdraw-view/withdraw-view-slice';

export const store = configureStore({
  reducer: {
    cyclesMinting: cyclesMintingCanisterReducer,
    plug: plugReducer,
    modals: modalsReducer,
    notification: notificationReducer,
    swap: swapReducer,
    price: priceReducer,
    keepSync: keepSyncReducer,

    activityView: activityViewReducer,
    assetsView: assetsViewReducer,
    depositView: depositViewReducer,
    liquidityView: liquidityViewReducer,
    swapView: swapViewReducer,
    withdrawView: withdrawViewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
