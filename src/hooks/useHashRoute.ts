import { useSyncExternalStore } from 'react';

export type Route = 'journal' | 'todos';

const DEFAULT_ROUTE: Route = 'journal';

function readRoute(): Route {
  const path = window.location.hash.replace(/^#\/?/, '');
  return path === 'journal' || path === 'todos' ? path : DEFAULT_ROUTE;
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

/** The current section, kept in the URL hash so links and the back button work. */
export function useHashRoute(): Route {
  return useSyncExternalStore(subscribe, readRoute);
}
