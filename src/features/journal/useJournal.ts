import { useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { toDateKey } from '../../lib/date';
import { createId } from '../../lib/id';
import { findMood, type MoodId } from './moods';

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  /** The day the entry is about, as a local 'YYYY-MM-DD' key. */
  date: string;
  mood: MoodId | null;
  tags: string[];
  createdAt: string;
}

export type JournalEntryChanges = Partial<Pick<JournalEntry, 'title' | 'body' | 'date' | 'mood' | 'tags'>>;

export interface TagCount {
  tag: string;
  count: number;
}

export function isBlank(entry: JournalEntry): boolean {
  return (
    entry.title.trim() === '' &&
    entry.body.trim() === '' &&
    entry.mood === null &&
    entry.tags.length === 0
  );
}

/** Fills in fields missing from entries saved by earlier versions of DayBook. */
function parseEntries(raw: unknown): JournalEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((stored: Partial<JournalEntry> & Pick<JournalEntry, 'id' | 'createdAt'>) => ({
    id: stored.id,
    title: stored.title ?? '',
    body: stored.body ?? '',
    date: stored.date ?? toDateKey(new Date(stored.createdAt)),
    mood: findMood(stored.mood)?.id ?? null,
    tags: Array.isArray(stored.tags) ? stored.tags : [],
    createdAt: stored.createdAt,
  }));
}

function newestFirst(a: JournalEntry, b: JournalEntry): number {
  return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
}

export function useJournal() {
  const [stored, setEntries, saveFailed] = useLocalStorage<JournalEntry[]>(
    'daybook.journal',
    [],
    parseEntries,
  );

  // Clears out any entry that was opened but left empty when the page closed.
  useEffect(() => {
    setEntries((current) => current.filter((entry) => !isBlank(entry)));
  }, [setEntries]);

  const entries = useMemo(() => [...stored].sort(newestFirst), [stored]);

  const allTags = useMemo<TagCount[]>(() => {
    const counts = new Map<string, number>();
    for (const entry of stored) {
      for (const tag of entry.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  }, [stored]);

  const createEntry = useCallback((): string => {
    const now = new Date();
    const entry: JournalEntry = {
      id: createId(),
      title: '',
      body: '',
      date: toDateKey(now),
      mood: null,
      tags: [],
      createdAt: now.toISOString(),
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

  /** Puts back an entry that was just deleted. */
  const restoreEntry = useCallback(
    (entry: JournalEntry) => {
      setEntries((current) => [...current, entry]);
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

  return { entries, allTags, saveFailed, createEntry, updateEntry, deleteEntry, restoreEntry, discardIfBlank };
}

export type Journal = ReturnType<typeof useJournal>;
