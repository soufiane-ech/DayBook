import { ListChecks, NotebookPen, type LucideIcon } from 'lucide-react';
import type { Route } from '../hooks/useHashRoute';
import { formatLongDate } from '../lib/date';
import { BrandMark } from './BrandMark';
import { ThemeToggle } from './ThemeToggle';

const ITEMS: { route: Route; label: string; Icon: LucideIcon }[] = [
  { route: 'journal', label: 'Journal', Icon: NotebookPen },
  { route: 'todos', label: 'Todo List', Icon: ListChecks },
];

/** Must match the height and gap of the rail links so the highlight lands on them. */
const RAIL_ITEM_STEP_REM = 2.75;

export type SectionCounts = Record<Route, number>;

interface NavigationProps {
  route: Route;
  counts: SectionCounts;
}

function activeIndexOf(route: Route): number {
  return ITEMS.findIndex((item) => item.route === route);
}

/** The dark navigation rail on tablets and desktops: icons only at first, labeled on wide screens. */
export function SidebarNavigation({ route, counts }: NavigationProps) {
  return (
    <aside className="bg-rail text-rail-ink hidden w-[4.5rem] shrink-0 flex-col p-3 md:flex lg:w-56">
      <a href="#/journal" className="flex items-center justify-center gap-2.5 rounded-lg lg:justify-start lg:px-1">
        <BrandMark />
        <span className="hidden font-serif text-lg font-medium tracking-tight lg:inline">DayBook</span>
      </a>

      <nav aria-label="Sections" className="relative mt-7">
        <span
          aria-hidden
          className="bg-rail-raised absolute inset-x-0 top-0 h-10 rounded-lg transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${activeIndexOf(route) * RAIL_ITEM_STEP_REM}rem)` }}
        />
        <div className="relative space-y-1">
          {ITEMS.map(({ route: target, label, Icon }) => {
            const isActive = target === route;
            return (
              <a
                key={target}
                href={`#/${target}`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
                title={label}
                className={`flex h-10 items-center justify-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200 lg:justify-start ${
                  isActive ? 'text-rail-ink' : 'text-rail-soft hover:text-rail-ink'
                }`}
              >
                <Icon className="size-[1.15rem] shrink-0" aria-hidden />
                <span className="hidden lg:inline">{label}</span>
                <span className="text-rail-soft ml-auto hidden text-xs tabular-nums lg:inline">{counts[target]}</span>
              </a>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto space-y-2">
        <p className="text-rail-soft hidden px-3 text-xs lg:block">{formatLongDate(new Date())}</p>
        <ThemeToggle className="text-rail-soft hover:bg-rail-raised hover:text-rail-ink flex h-10 w-full items-center justify-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200 lg:justify-start" />
      </div>
    </aside>
  );
}

export function MobileHeader() {
  return (
    <header className="border-line bg-card flex items-center justify-between border-b px-4 py-2 md:hidden">
      <a href="#/journal" className="flex items-center gap-2.5 rounded-lg">
        <BrandMark />
        <span className="font-serif text-lg font-medium tracking-tight">DayBook</span>
      </a>
      <ThemeToggle className="icon-btn p-2" />
    </header>
  );
}

export function MobileTabBar({ route }: { route: Route }) {
  return (
    <nav aria-label="Sections" className="border-line bg-card relative grid grid-cols-2 border-t md:hidden">
      <span
        aria-hidden
        className="bg-accent absolute top-0 left-0 h-0.5 w-1/2 transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndexOf(route) * 100}%)` }}
      />
      {ITEMS.map(({ route: target, label, Icon }) => {
        const isActive = target === route;
        return (
          <a
            key={target}
            href={`#/${target}`}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors duration-200 ${
              isActive ? 'text-accent' : 'text-ink-soft'
            }`}
          >
            <Icon className="size-5" aria-hidden />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
