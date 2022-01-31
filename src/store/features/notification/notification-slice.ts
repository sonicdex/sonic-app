import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';

import type { RootState } from '@/store';
import { FeatureState } from '@/store';

export enum NotificationType {
  Success,
  Error,
  Swap,
  Deposit,
  Withdraw,
  AddLiquidity,
  RemoveLiquidity,
  Unwrap,
  Wrap,
  MintXTC,
  FinishMint,
}

export interface Notification {
  id: string;
  title: React.ReactNode;
  errorMessage?: string;
  type: NotificationType;
  transactionLink?: string;
  timeout?: string;
}

export interface NotificationsState {
  notifications: Array<Notification>;
  state: FeatureState;
}

const initialState: NotificationsState = {
  notifications: [],
  state: FeatureState?.Idle,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<FeatureState>) => {
      state.state = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    popNotification: (state, action: PayloadAction<string>) => {
      const popId = action.payload;
      const filteredNotifications = state.notifications.filter(
        (obj) => obj.id !== popId
      );

      state.notifications = filteredNotifications;
    },
  },
});

export const {
  setState: setNotificationState,
  addNotification,
  popNotification,
} = notificationSlice.actions;

export const selectNotificationState = (state: RootState) => state.notification;

export default notificationSlice.reducer;
