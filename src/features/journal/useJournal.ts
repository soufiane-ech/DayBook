import { useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { createId } from '../../lib/id';

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export type JournalEntryChanges = Partial<Pick<JournalEntry, 'title' | 'body'>>;

function isBlank(entry: JournalEntry): boolean {
  return entry.title.trim() === '' && entry.body.trim() === '';
}

export function useJournal() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('daybook.journal', []);

  const createEntry = useCallback((): string => {
    const entry: JournalEntry = {
      id: createId(),
      title: '',
      body: '',
      createdAt: new Date().toISOString(),
    };
    setEntries((current) => [entry, ...current]);
    return entry.id;
  }, [setEntries]);

  const updateEntry = useCallback(
    (id: string, changes: JournalEntryChanges) => {
      setEntries((current) =>
        current.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry)),
      );
    },
    [setEntries],
  );

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((current) => current.filter((entry) => entry.id !== id));
    },
    [setEntries],
  );

  /** Removes an entry that was opened but never written in. */
  const discardIfBlank = useCallback(
    (id: string) => {
      setEntries((current) => current.filter((entry) => entry.id !== id || !isBlank(entry)));
    },
    [setEntries],
  );

  return { entries, createEntry, updateEntry, deleteEntry, discardIfBlank };
}

export type Journal = ReturnType<typeof useJournal>;
