import { configureStore } from '@reduxjs/toolkit';

import plugReducer from '@/store/features/plug/plug-slice';
import modalsReducer from '@/store/features/modals/modals-slice';
import notificationReducer from '@/store/features/notification/notification-slice';

import activityViewReducer from '@/store/features/activity-view/activity-view-slice';
import assetsViewReducer from '@/store/features/assets-view/assets-view-slice';
import liquidityViewReducer from '@/store/features/liquidity-view/liquidity-view-slice';
import swapViewReducer from '@/store/features/swap-view/swap-view-slice';
import depositViewReducer from '@/store/features/deposit-view/deposit-view-slice';
import withdrawViewReducer from '@/store/features/withdraw-view/withdraw-view-slice';

import swapReducer from '@/store/features/swap/swap-slice';

export const store = configureStore({
  reducer: {
    plug: plugReducer,
    modals: modalsReducer,
    notification: notificationReducer,
    swap: swapReducer,
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
