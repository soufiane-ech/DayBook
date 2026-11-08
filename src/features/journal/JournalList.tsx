import { formatMonthAndYear, formatShortWeekday } from '../../lib/date';
import { findMood } from './moods';
import type { JournalEntry } from './useJournal';

const MAX_VISIBLE_TAGS = 3;

interface MonthGroup {
  month: string;
  entries: JournalEntry[];
}

/** Expects entries already sorted by date. */
function groupByMonth(entries: JournalEntry[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const entry of entries) {
    const month = entry.date.slice(0, 7);
    const last = groups.at(-1);
    if (last?.month === month) last.entries.push(entry);
    else groups.push({ month, entries: [entry] });
  }
  return groups;
}

interface JournalListProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function JournalList({ entries, selectedId, onSelect }: JournalListProps) {
  return (
    <div className="space-y-5">
      {groupByMonth(entries).map((group) => (
        <section key={group.month}>
          <h2 className="text-ink-soft px-2.5 pb-1.5 text-xs font-semibold">
            {formatMonthAndYear(group.entries[0].date)}
          </h2>
          <ul className="space-y-0.5">
            {group.entries.map((entry) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                isSelected={entry.id === selectedId}
                onSelect={() => onSelect(entry.id)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

interface EntryRowProps {
  entry: JournalEntry;
  isSelected: boolean;
  onSelect: () => void;
}

function EntryRow({ entry, isSelected, onSelect }: EntryRowProps) {
  const mood = findMood(entry.mood);
  const visibleTags = entry.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = entry.tags.length - visibleTags.length;

  return (
    <li className="animate-item-in">
      <button
        type="button"
        onClick={onSelect}
        aria-current={isSelected ? 'true' : undefined}
        className={`flex w-full gap-3 rounded-xl border px-2.5 py-2.5 text-left transition duration-200 ${
          isSelected ? 'border-accent/40 bg-card shadow-soft' : 'hover:bg-line/40 border-transparent'
        }`}
      >
        <span className="w-9 shrink-0 text-center">
          <span className="text-ink-soft block text-xs">{formatShortWeekday(entry.date)}</span>
          <span className="block font-serif text-xl leading-tight">{Number(entry.date.slice(8))}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="min-w-0 flex-1 truncate font-medium">{entry.title.trim() || 'Untitled'}</span>
            {mood && (
              <span role="img" aria-label={mood.label} className="shrink-0 leading-none">
                {mood.emoji}
              </span>
            )}
          </span>
          {entry.body.trim() && (
            <span className="text-ink-soft mt-0.5 block truncate text-sm">{entry.body.trim()}</span>
          )}
          {entry.tags.length > 0 && (
            <span className="text-ink-soft mt-1 flex gap-1.5 overflow-hidden text-xs">
              {visibleTags.map((tag) => (
                <span key={tag} className="truncate">
                  #{tag}
                </span>
              ))}
              {hiddenTagCount > 0 && <span className="shrink-0">+{hiddenTagCount}</span>}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}
