import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { getTheme, subscribeToTheme, toggleTheme } from '../lib/theme';

const ICON_CLASS = 'absolute inset-0 size-[1.15rem] transition duration-300 ease-out';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribeToTheme, getTheme) === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button type="button" onClick={toggleTheme} aria-label={label} title={label} className={className}>
      <span className="relative block size-[1.15rem] shrink-0">
        <Sun aria-hidden className={`${ICON_CLASS} ${isDark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
        <Moon aria-hidden className={`${ICON_CLASS} ${isDark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
      </span>
      <span className="hidden lg:inline">{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}
