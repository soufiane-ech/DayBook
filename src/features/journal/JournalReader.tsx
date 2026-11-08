import { Pencil } from 'lucide-react';
import { formatFullDate } from '../../lib/date';
import { EntryPanel, PRIMARY_ACTION_CLASS } from './EntryPanel';
import { findMood } from './moods';
import type { JournalEntry } from './useJournal';

interface JournalReaderProps {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export function JournalReader({ entry, onEdit, onDelete, onBack }: JournalReaderProps) {
  const mood = findMood(entry.mood);

  return (
    <EntryPanel
      onBack={onBack}
      onDelete={onDelete}
      action={
        <button type="button" onClick={onEdit} className={PRIMARY_ACTION_CLASS}>
          <Pencil className="size-3.5" aria-hidden />
          Edit
        </button>
      }
    >
      <time dateTime={entry.date} className="text-ink-soft text-sm">
        {formatFullDate(entry.date)}
      </time>
      <h2 className="mt-2 font-serif text-2xl tracking-tight wrap-break-word md:text-3xl">
        {entry.title.trim() || 'Untitled'}
      </h2>

      {mood && (
        <p className="bg-accent-soft text-accent mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
          <span aria-hidden className="text-base leading-none">
            {mood.emoji}
          </span>
          {mood.label}
        </p>
      )}

      {entry.body.trim() ? (
        <p className="mt-5 font-serif text-[1.0625rem] leading-8 wrap-anywhere whitespace-pre-wrap">
          {entry.body}
        </p>
      ) : (
        <p className="text-ink-soft mt-5 italic">Nothing written for this day.</p>
      )}

      {entry.tags.length > 0 && (
        <ul className="border-line mt-6 flex flex-wrap gap-1.5 border-t pt-4">
          {entry.tags.map((tag) => (
            <li key={tag} className="bg-line/60 text-ink-soft rounded-full px-2.5 py-0.5 text-sm wrap-anywhere">
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </EntryPanel>
  );
}
