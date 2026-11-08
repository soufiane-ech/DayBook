import { Bookmark } from 'lucide-react';
import type { Route } from '../hooks/useHashRoute';
import { Navigation } from './Navigation';

export function Header({ route }: { route: Route }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
      <a href="#/journal" className="flex items-center gap-2 rounded-md">
        <span className="bg-accent text-paper grid size-8 place-items-center rounded-lg">
          <Bookmark className="size-4" fill="currentColor" aria-hidden />
        </span>
        <span className="font-serif text-xl font-medium tracking-tight">DayBook</span>
      </a>
      <Navigation route={route} />
    </header>
  );
}
