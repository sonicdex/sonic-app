import { createAsyncThunk } from '@reduxjs/toolkit';

import { plug } from '@/integrations/plug';

import { plugSlice, PlugState } from '../plug-slice';

export const disconnect = createAsyncThunk<void>(
  'plug/disconnect',
  async (_, { dispatch }): Promise<void> => {
    dispatch(plugSlice.actions.setState(PlugState.Loading));

    if (plug) {
      dispatch(plugSlice.actions.setState(PlugState.Disconnected));
      plug.disconnect();
    } else {
      dispatch(plugSlice.actions.setState(PlugState.NotInstalled));
    }
  }
);
