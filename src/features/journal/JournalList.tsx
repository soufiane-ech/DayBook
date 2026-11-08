import { formatShortDate } from '../../lib/date';
import type { JournalEntry } from './useJournal';

interface JournalListProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function JournalList({ entries, selectedId, onSelect }: JournalListProps) {
  return (
    <ul className="-mx-1 min-h-0 flex-1 space-y-1 overflow-y-auto p-1">
      {entries.map((entry) => {
        const isSelected = entry.id === selectedId;
        return (
          <li key={entry.id} className="animate-item-in">
            <button
              type="button"
              onClick={() => onSelect(entry.id)}
              aria-current={isSelected ? 'true' : undefined}
              className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors duration-200 ${
                isSelected ? 'bg-accent-soft' : 'hover:bg-line/50'
              }`}
            >
              <span className="block truncate font-medium">{entry.title.trim() || 'Untitled'}</span>
              <span className="text-ink-soft mt-0.5 flex gap-2 text-sm">
                <span className="shrink-0">{formatShortDate(entry.createdAt)}</span>
                <span className="truncate">{entry.body.trim()}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
