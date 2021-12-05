import { configureStore } from '@reduxjs/toolkit';

import actorReducer from '@/store/features/actor/actor-slice';
import plugReducer from '@/store/features/plug/plug-slice';
import notificationReducer from '@/store/features/notification/notification-slice';

import activityViewReducer from '@/store/features/activity-view/activity-view-slice';
import assetsViewReducer from '@/store/features/assets-view/assets-view-slice';
import liquidityViewReducer from '@/store/features/liquidity-view/liquidity-view-slice';
import swapViewReducer from '@/store/features/swap-view/swap-view-slice';

export const store = configureStore({
  reducer: {
    actor: actorReducer,
    plug: plugReducer,
    notification: notificationReducer,
    swapView: swapViewReducer,
    assetsView: assetsViewReducer,
    liquidityView: liquidityViewReducer,
    activityView: activityViewReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
