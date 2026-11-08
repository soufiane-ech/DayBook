export type TodoFilter = 'all' | 'active' | 'done';

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
];

interface TodoFiltersProps {
  value: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}

export function TodoFilters({ value, onChange }: TodoFiltersProps) {
  return (
    <div role="group" aria-label="Filter tasks" className="flex gap-1">
      {FILTERS.map((filter) => {
        const isActive = filter.value === value;
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1 text-sm transition-colors duration-200 ${
              isActive ? 'bg-accent-soft text-accent font-medium' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
