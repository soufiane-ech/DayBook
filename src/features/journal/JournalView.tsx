import { Feather } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { JournalBrowser } from './JournalBrowser';
import { JournalEditor } from './JournalEditor';
import { JournalReader } from './JournalReader';
import { isBlank, type Journal } from './useJournal';

export function JournalView({ journal }: { journal: Journal }) {
  const { entries, allTags, saveFailed, createEntry, updateEntry, deleteEntry, discardIfBlank } = journal;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const selected = entries.find((entry) => entry.id === selectedId) ?? null;
  const tagSuggestions = useMemo(() => allTags.map((item) => item.tag), [allTags]);

  useEffect(() => {
    return () => {
      if (selectedId) discardIfBlank(selectedId);
    };
  }, [selectedId, discardIfBlank]);

  function startNew() {
    setSelectedId(createEntry());
    setIsEditing(true);
  }

  function select(id: string) {
    if (id === selectedId) return;
    setSelectedId(id);
    setIsEditing(false);
  }

  function close() {
    setSelectedId(null);
    setIsEditing(false);
  }

  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] gap-4 md:grid-cols-[20rem_minmax(0,1fr)] md:gap-6">
      {/* On phones the list and the entry take turns filling the screen. */}
      <section className={`-mx-1 min-h-0 flex-col overflow-y-auto px-1 pb-1 ${selected ? 'hidden md:flex' : 'flex'}`}>
        <JournalBrowser
          entries={entries}
          tags={allTags}
          selectedId={selectedId}
          onSelect={select}
          onNew={startNew}
        />
      </section>

      <section className={`min-h-0 ${selected ? 'block' : 'hidden md:block'}`}>
        {!selected ? (
          <div className="border-line grid h-full place-items-center rounded-2xl border border-dashed">
            <EmptyState Icon={Feather} title="Pick a page" hint="Choose an entry, or start a new one." />
          </div>
        ) : isEditing ? (
          <JournalEditor
            key={`edit-${selected.id}`}
            entry={selected}
            tagSuggestions={tagSuggestions}
            saveFailed={saveFailed}
            onChange={(changes) => updateEntry(selected.id, changes)}
            onDone={() => (isBlank(selected) ? close() : setIsEditing(false))}
            onDelete={() => {
              deleteEntry(selected.id);
              close();
            }}
            onBack={close}
          />
        ) : (
          <JournalReader
            key={`read-${selected.id}`}
            entry={selected}
            onEdit={() => setIsEditing(true)}
            onDelete={() => {
              deleteEntry(selected.id);
              close();
            }}
            onBack={close}
          />
        )}
      </section>
    </div>
  );
}
