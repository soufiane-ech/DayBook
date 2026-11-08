import { Feather, Plus, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { JournalFilterPanel } from './JournalFilterPanel';
import { countPanelFilters, hasFilters, matchesFilters, NO_FILTERS, type JournalFilters } from './journalFilters';
import { JournalList } from './JournalList';
import type { JournalEntry, TagCount } from './useJournal';

interface JournalBrowserProps {
  entries: JournalEntry[];
  tags: TagCount[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

/** The list pane: new entry, search, filters, and past entries. */
export function JournalBrowser({ entries, tags, selectedId, onSelect, onNew }: JournalBrowserProps) {
  const [filters, setFilters] = useState<JournalFilters>(NO_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The open entry stays listed, so it doesn't vanish when an edit stops it matching.
  const visible = useMemo(
    () => entries.filter((entry) => entry.id === selectedId || matchesFilters(entry, filters)),
    [entries, filters, selectedId],
  );

  const panelFilterCount = countPanelFilters(filters);
  const isFiltering = hasFilters(filters);

  function changeFilters(changes: Partial<JournalFilters>) {
    setFilters((current) => ({ ...current, ...changes }));
  }

  function startNew() {
    // Otherwise the new entry could disappear from the list once it's closed.
    setFilters(NO_FILTERS);
    onNew();
  }

  return (
    <>
      <div className="flex items-center justify-between pt-4 pb-3">
        <h1 className="font-serif text-2xl tracking-tight">Journal</h1>
        <button type="button" onClick={startNew} className="btn btn-primary">
          <Plus className="size-4" aria-hidden />
          New entry
        </button>
      </div>

      <div className="bg-sunken sticky top-0 z-10 flex gap-2 py-0.5">
        <div className="relative min-w-0 flex-1">
          <Search className="text-ink-soft pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
          <input
            value={filters.query}
            onChange={(event) => changeFilters({ query: event.target.value })}
            placeholder="Search entries"
            aria-label="Search entries"
            className="field placeholder:text-ink-soft/70 w-full pr-8 pl-9 text-base sm:text-sm"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => changeFilters({ query: '' })}
              aria-label="Clear search"
              className="text-ink-soft hover:text-ink absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-0.5 transition-colors"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          aria-controls="journal-filters"
          className={`btn border ${
            filtersOpen || panelFilterCount > 0
              ? 'border-accent/40 bg-accent-soft text-accent'
              : 'border-line bg-card text-ink-soft hover:text-ink font-normal'
          }`}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters
          {panelFilterCount > 0 && <span className="tabular-nums">{panelFilterCount}</span>}
        </button>
      </div>

      <JournalFilterPanel open={filtersOpen} filters={filters} tags={tags} onChange={changeFilters} />

      <div className="text-ink-soft flex items-center justify-between px-2.5 pt-3 pb-2 text-xs">
        <span>
          {isFiltering ? `${visible.length} of ${entries.length}` : entries.length}{' '}
          {entries.length === 1 ? 'entry' : 'entries'}
        </span>
        {isFiltering && (
          <button
            type="button"
            onClick={() => setFilters(NO_FILTERS)}
            className="animate-item-in hover:text-accent rounded-md font-medium underline-offset-2 transition-colors hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <JournalList entries={visible} selectedId={selectedId} onSelect={onSelect} />
      ) : isFiltering ? (
        <EmptyState Icon={SearchX} title="No matching entries" hint="Try a different word or fewer filters." />
      ) : (
        <EmptyState
          Icon={Feather}
          title="Nothing here yet"
          hint="Your thoughts stay private, saved right here in this browser."
          action={{ label: 'Write your first entry', onClick: startNew }}
        />
      )}
    </>
  );
}
