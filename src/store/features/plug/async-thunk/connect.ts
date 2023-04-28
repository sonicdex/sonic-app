import { createAsyncThunk } from '@reduxjs/toolkit';

import { ENV } from '@/config';
import { plug } from '@/integrations/plug';
import { RootState } from '@/store/store';
import { AppLog } from '@/utils';

import { plugSlice, PlugState } from '../plug-slice';
import { disconnect } from './disconnect';
import { tokenList} from '@/utils'
//import {artemis} from '@/utils';

export const connect = createAsyncThunk<void>(
  'plug/connect',
  async (_, { dispatch, getState }): Promise<void> => {
    if ((getState() as RootState).plug.state === PlugState.Loading) return;
    dispatch(plugSlice.actions.setState(PlugState.Loading));
    var tknList= tokenList("obj");
    if (plug) {
      try {
        const accountChangeCallback = async (
          newPrincipalId: string
        ): Promise<void> => {
          AppLog.warn(`Connected to Plug with principal ${newPrincipalId}`);
          dispatch(plugSlice.actions.setPrincipalId(newPrincipalId));
        };
        await plug.requestConnect({
          host: ENV.host,
          whitelist: [...Object.values(ENV.canistersPrincipalIDs),...Object.keys(tknList)],
          onConnectionUpdate: (data: any) => {
            if (!data.sessionData) {
              return dispatch(disconnect());
            }
            accountChangeCallback(data.sessionData.principalId);
          },
        });
        
       // artemis.connect('plug', { whitelist: Object.values(ENV.canistersPrincipalIDs)} );

        const principal = await plug.getPrincipal();
        await accountChangeCallback(
          typeof principal === 'string' ? principal : principal.toText()
        );
      } catch (e) {
        AppLog.error('Could not connect to Plug', e);
        dispatch(plugSlice.actions.setState(PlugState.Disconnected));
      }
    } else {
      dispatch(plugSlice.actions.setState(PlugState.NotInstalled));
    }
  }
);
