import { useCallback } from 'react';
import { useLocation } from 'react-router';

export const useQuery = () => {
  const location = useLocation();

  return {
    get: useCallback(
      (key: string) => new URLSearchParams(location.search).get(key),
      [location.search]
    ),
    delete: useCallback(
      (key: string) => {
        const query = new URLSearchParams(location.search);
        query.delete(key);
        location.search = query.toString();

        window.history.replaceState(
          {},
          '',
          location.pathname +
            (location.search !== '' ? `?${location.search}` : '')
        );
      },
      [location.search]
    ),
  };
};
