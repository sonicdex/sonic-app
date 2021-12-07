import {
  FeatureState,
  plugActions,
  useAppDispatch,
  usePlugStore,
} from '@/store';
import { useEffect } from 'react';
import { checkIsConnected, getPrincipal } from '.';

export const usePlugInit = () => {
  const { isConnected } = usePlugStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(plugActions.setState(FeatureState.Loading));

    const connectionPromise = checkIsConnected();

    if (connectionPromise) {
      connectionPromise
        .then(async (isConnected) => {
          if (isConnected) {
            const hasPrincipal = await getPrincipal();
            if (hasPrincipal)
              return dispatch(plugActions.setIsConnected(isConnected));
          }
          return dispatch(plugActions.setIsConnected(false));
        })
        .catch((err) => {
          console.error(err);
          dispatch(plugActions.setIsConnected(false));
          dispatch(plugActions.setState(FeatureState.Error));
        });
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      const getPrincipalId = async () => {
        try {
          const principal = await getPrincipal();

          if (principal) {
            if (typeof principal === 'string') {
              dispatch(
                plugActions.setPrincipalId(principal as unknown as string)
              );
            } else {
              dispatch(plugActions.setPrincipalId(principal.toText()));
            }
          }
          dispatch(plugActions.setState(FeatureState.Idle));
        } catch (err) {
          console.error(err);
          dispatch(plugActions.setState(FeatureState.Error));
        }
      };

      const isPlug = Boolean(window?.ic?.plug);
      if (isPlug) {
        getPrincipalId();
      }
    }

    dispatch(plugActions.setState(FeatureState.Idle));
  }, [isConnected]);
};
