import { ListChecks, NotebookPen, type LucideIcon } from 'lucide-react';
import type { Route } from '../hooks/useHashRoute';

const ITEMS: { route: Route; label: string; Icon: LucideIcon }[] = [
  { route: 'journal', label: 'Journal', Icon: NotebookPen },
  { route: 'todos', label: 'Todo List', Icon: ListChecks },
];

export function Navigation({ route }: { route: Route }) {
  const activeIndex = ITEMS.findIndex((item) => item.route === route);

  return (
    <nav aria-label="Sections" className="bg-line/70 relative grid grid-cols-2 rounded-full p-1">
      <span
        aria-hidden
        className="bg-card absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {ITEMS.map(({ route: target, label, Icon }) => {
        const isActive = target === route;
        return (
          <a
            key={target}
            href={`#/${target}`}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 sm:px-4 ${
              isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <Icon className="hidden size-4 shrink-0 sm:block" aria-hidden />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
