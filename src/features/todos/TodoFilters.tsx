import { CalendarClock, CalendarDays, CircleCheck, CircleDashed, Inbox, type LucideIcon } from 'lucide-react';
import type { TodoFilter } from './todoOrganizer';

const OPTIONS: { value: TodoFilter; label: string; Icon: LucideIcon }[] = [
  { value: 'all', label: 'All', Icon: Inbox },
  { value: 'active', label: 'Active', Icon: CircleDashed },
  { value: 'completed', label: 'Completed', Icon: CircleCheck },
  { value: 'today', label: 'Today', Icon: CalendarDays },
  { value: 'upcoming', label: 'Upcoming', Icon: CalendarClock },
];

interface TodoFiltersProps {
  value: TodoFilter;
  counts: Record<TodoFilter, number>;
  onChange: (filter: TodoFilter) => void;
}

/** A wrapping row of chips on phones and a vertical menu beside the list on larger screens. */
export function TodoFilters({ value, counts, onChange }: TodoFiltersProps) {
  return (
    <div role="group" aria-label="Filter tasks" className="flex flex-wrap gap-1.5 md:flex-col md:gap-0.5">
      {OPTIONS.map(({ value: option, label, Icon }) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1 text-sm transition-colors duration-150 md:py-2 ${
              isActive ? 'bg-accent-soft text-accent font-medium' : 'text-ink-soft hover:bg-line/50 hover:text-ink'
            }`}
          >
            <Icon className="hidden size-4 shrink-0 md:block" aria-hidden />
            {label}
            <span className="tabular-nums opacity-70 md:ml-auto">{counts[option]}</span>
          </button>
        );
      })}
    </div>
  );
}
