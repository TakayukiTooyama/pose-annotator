import { useEffect } from 'react';

export const useBlockBrowserNavigation = () => {
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      e.preventDefault();
      history.go(1);
    };

    history.pushState(null, '', location.href);
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);
};
