import { Feather } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../hooks/useToast';
import { JournalBrowser } from './JournalBrowser';
import { JournalEditor } from './JournalEditor';
import { JournalReader } from './JournalReader';
import { isBlank, type Journal, type JournalEntry } from './useJournal';

export function JournalView({ journal }: { journal: Journal }) {
  const { entries, allTags, saveFailed, createEntry, updateEntry, deleteEntry, restoreEntry, discardIfBlank } = journal;
  const showToast = useToast();
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

  function finishEditing(entry: JournalEntry) {
    if (isBlank(entry)) {
      close();
      showToast({ message: 'Empty entry discarded' });
    } else {
      setIsEditing(false);
    }
  }

  function remove(entry: JournalEntry) {
    deleteEntry(entry.id);
    close();
    showToast({ message: 'Entry deleted', undo: () => restoreEntry(entry) });
  }

  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] md:grid-cols-[18rem_minmax(0,1fr)] lg:grid-cols-[21rem_minmax(0,1fr)]">
      {/* On phones the list and the entry take turns filling the screen. */}
      <section
        className={`bg-sunken border-line min-h-0 flex-col overflow-y-auto px-3 pb-3 md:border-r ${
          selected ? 'hidden md:flex' : 'flex'
        }`}
      >
        <JournalBrowser
          entries={entries}
          tags={allTags}
          selectedId={selectedId}
          onSelect={select}
          onNew={startNew}
        />
      </section>

      <section className={`bg-card min-h-0 ${selected ? 'block' : 'hidden md:block'}`}>
        {!selected ? (
          <div className="grid h-full place-items-center">
            <EmptyState Icon={Feather} title="Pick a page" hint="Choose an entry on the left, or start a new one." />
          </div>
        ) : isEditing ? (
          <JournalEditor
            key={`edit-${selected.id}`}
            entry={selected}
            tagSuggestions={tagSuggestions}
            saveFailed={saveFailed}
            onChange={(changes) => updateEntry(selected.id, changes)}
            onDone={() => finishEditing(selected)}
            onDelete={() => remove(selected)}
            onBack={close}
          />
        ) : (
          <JournalReader
            key={`read-${selected.id}`}
            entry={selected}
            onEdit={() => setIsEditing(true)}
            onDelete={() => remove(selected)}
            onBack={close}
          />
        )}
      </section>
    </div>
  );
}
