import { configureStore } from '@reduxjs/toolkit';

import actorReducer from '@/store/features/actor/actor-slice';
import plugReducer from '@/store/features/plug/plug-slice';

export const store = configureStore({
  reducer: {
    actor: actorReducer,
    plug: plugReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
