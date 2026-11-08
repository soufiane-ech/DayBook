import { Feather, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { JournalEditor } from './JournalEditor';
import { JournalList } from './JournalList';
import type { Journal } from './useJournal';

export function JournalView({ journal }: { journal: Journal }) {
  const { entries, createEntry, updateEntry, deleteEntry, discardIfBlank } = journal;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = entries.find((entry) => entry.id === selectedId) ?? null;

  useEffect(() => {
    return () => {
      if (selectedId) discardIfBlank(selectedId);
    };
  }, [selectedId, discardIfBlank]);

  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[18rem_minmax(0,1fr)] md:gap-6">
      {/* On phones the list and the editor take turns filling the screen. */}
      <section className={`min-h-0 flex-col ${selected ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center justify-between pb-3">
          <h1 className="font-serif text-2xl tracking-tight">Journal</h1>
          <button
            type="button"
            onClick={() => setSelectedId(createEntry())}
            className="bg-ink text-paper flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-transform duration-150 hover:-translate-y-px active:translate-y-0"
          >
            <Plus className="size-4" aria-hidden />
            New entry
          </button>
        </div>
        {entries.length === 0 ? (
          <EmptyState Icon={Feather} title="Nothing here yet" hint="Start with one line about today." />
        ) : (
          <JournalList entries={entries} selectedId={selectedId} onSelect={setSelectedId} />
        )}
      </section>

      <section className={`min-h-0 ${selected ? 'block' : 'hidden md:block'}`}>
        {selected ? (
          <JournalEditor
            key={selected.id}
            entry={selected}
            onChange={(changes) => updateEntry(selected.id, changes)}
            onDelete={() => {
              deleteEntry(selected.id);
              setSelectedId(null);
            }}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <div className="border-line grid h-full place-items-center rounded-2xl border border-dashed">
            <EmptyState Icon={Feather} title="Pick a page" hint="Choose an entry, or start a new one." />
          </div>
        )}
      </section>
    </div>
  );
}
