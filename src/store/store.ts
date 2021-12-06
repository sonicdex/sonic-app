import { configureStore } from '@reduxjs/toolkit';

import actorReducer from '@/store/features/actor/actor-slice';
import plugReducer from '@/store/features/plug/plug-slice';
import modalReducer from '@/store/features/modal/modal-slice';
import notificationReducer from '@/store/features/notification/notification-slice';

export const store = configureStore({
  reducer: {
    actor: actorReducer,
    plug: plugReducer,
    modal: modalReducer,
    notification: notificationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
