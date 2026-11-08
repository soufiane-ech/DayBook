import { findMood, type MoodId } from './moods';
import type { JournalEntry } from './useJournal';

export interface JournalFilters {
  query: string;
  from: string;
  to: string;
  moods: MoodId[];
  tags: string[];
}

export const NO_FILTERS: JournalFilters = { query: '', from: '', to: '', moods: [], tags: [] };

function matchesQuery(entry: JournalEntry, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const text = [entry.title, entry.body, findMood(entry.mood)?.label ?? '', ...entry.tags]
    .join(' ')
    .toLowerCase();
  return terms.every((term) => text.includes(term));
}

export function matchesFilters(entry: JournalEntry, filters: JournalFilters): boolean {
  const { query, moods, tags } = filters;
  // A range entered backwards still means the days between the two dates.
  const reversed = filters.from && filters.to && filters.from > filters.to;
  const from = reversed ? filters.to : filters.from;
  const to = reversed ? filters.from : filters.to;

  if (from && entry.date < from) return false;
  if (to && entry.date > to) return false;
  if (moods.length > 0 && (entry.mood === null || !moods.includes(entry.mood))) return false;
  if (!tags.every((tag) => entry.tags.includes(tag))) return false;
  return matchesQuery(entry, query);
}

/** How many date, mood, and tag filters are on. Search is visible on its own, so it isn't counted. */
export function countPanelFilters(filters: JournalFilters): number {
  return (filters.from || filters.to ? 1 : 0) + filters.moods.length + filters.tags.length;
}

export function hasFilters(filters: JournalFilters): boolean {
  return filters.query.trim() !== '' || countPanelFilters(filters) > 0;
}
