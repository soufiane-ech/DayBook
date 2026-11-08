import type { JournalFilters } from './journalFilters';
import { MoodPicker } from './MoodPicker';
import type { MoodId } from './moods';
import type { TagCount } from './useJournal';

interface JournalFilterPanelProps {
  open: boolean;
  filters: JournalFilters;
  tags: TagCount[];
  onChange: (changes: Partial<JournalFilters>) => void;
}

const DATE_INPUT_CLASS = 'field w-full min-w-0 text-sm';

function toggled<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((other) => other !== item) : [...list, item];
}

export function JournalFilterPanel({ open, filters, tags, onChange }: JournalFilterPanelProps) {
  // A selected tag stays listed even after its last entry is gone, so it can be switched off.
  const missingTags = filters.tags.filter((tag) => !tags.some((item) => item.tag === tag));
  const options = [...tags, ...missingTags.map((tag) => ({ tag, count: 0 }))];

  return (
    <div
      id="journal-filters"
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div inert={!open} className="min-h-0 overflow-hidden">
        <div className="space-y-3 p-0.5 pt-3 pb-1">
          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="section-label">From</span>
              <input
                type="date"
                value={filters.from}
                onChange={(event) => onChange({ from: event.target.value })}
                className={DATE_INPUT_CLASS}
              />
            </label>
            <label>
              <span className="section-label">To</span>
              <input
                type="date"
                value={filters.to}
                onChange={(event) => onChange({ to: event.target.value })}
                className={DATE_INPUT_CLASS}
              />
            </label>
          </div>

          <div role="group" aria-label="Filter by mood">
            <span className="section-label">Mood</span>
            <MoodPicker
              compact
              selected={filters.moods}
              onToggle={(mood: MoodId) => onChange({ moods: toggled(filters.moods, mood) })}
            />
          </div>

          <div role="group" aria-label="Filter by tag">
            <span className="section-label">Tags</span>
            {options.length === 0 ? (
              <p className="text-ink-soft text-sm">Tags you add to entries will appear here.</p>
            ) : (
              <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto p-0.5">
                {options.map(({ tag, count }) => {
                  const isActive = filters.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onChange({ tags: toggled(filters.tags, tag) })}
                      aria-pressed={isActive}
                      className={`chip max-w-full truncate py-0.5 ${isActive ? 'chip-on' : ''}`}
                    >
                      #{tag} <span className="opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
