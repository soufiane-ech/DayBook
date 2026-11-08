export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'daybook.theme';
const THEME_COLORS: Record<Theme, string> = { light: '#ffffff', dark: '#1f1d1a' };
const CROSSFADE_MS = 300;

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const listeners = new Set<() => void>();
let crossfadeTimer: number | undefined;

function readSaved(): Theme | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return prefersDark.matches ? 'dark' : 'light';
}

function syncBrowserChrome(theme: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (!prefersReducedMotion.matches) {
    root.classList.add('theme-switching');
    window.clearTimeout(crossfadeTimer);
    crossfadeTimer = window.setTimeout(() => root.classList.remove('theme-switching'), CROSSFADE_MS);
  }
  root.dataset.theme = theme;
  syncBrowserChrome(theme);
  listeners.forEach((listener) => listener());
}

/** The theme on the page. An inline script in index.html sets it before the first paint. */
export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function subscribeToTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function toggleTheme() {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch (error) {
    console.warn('Could not remember the theme', error);
  }
  applyTheme(next);
}

syncBrowserChrome(getTheme());

// With no saved choice, keep following the system setting.
prefersDark.addEventListener('change', () => {
  if (readSaved() === null) applyTheme(systemTheme());
});

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) applyTheme(readSaved() ?? systemTheme());
});
