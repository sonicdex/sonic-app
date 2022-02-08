import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import React from 'react';

import type { RootState } from '@/store';
import { FeatureState } from '@/store';

export enum NotificationType {
  Success,
  Error,

  Deposit,
  Withdraw,

  Swap,

  AddLiquidity,
  RemoveLiquidity,

  MintXTC,
  MintWICP,
  WithdrawWICP,
  MintAuto,
  MintManual,
}

export enum NotificationState {
  Idle,
  Pending,
  Success,
  Error,
}

export interface Notification {
  id: string;
  title: React.ReactNode;
  errorMessage?: string;
  type: NotificationType;
  transactionLink?: string;
  timeout?: string;
  // TODO: Rewrite notifications to use this
  state?: NotificationState;
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
    setNotificationData: (
      state,
      action: PayloadAction<{
        data: Omit<Partial<Notification>, 'id'>;
        id: string;
      }>
    ) => {
      const notificationIndex = state.notifications.findIndex(
        (notification) => notification.id === action.payload.id
      );

      if (typeof notificationIndex !== 'undefined') {
        const newNotifications = state.notifications.map(
          (notification, index) => {
            if (index === notificationIndex) {
              return {
                ...notification,
                ...action.payload.data,
              };
            }

            return notification;
          }
        );

        state.notifications = newNotifications;
      }
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
  setState: setNotificationSliceState,
  addNotification,
  popNotification,
  setNotificationData,
} = notificationSlice.actions;

export const selectNotificationState = (state: RootState) => state.notification;

export default notificationSlice.reducer;
