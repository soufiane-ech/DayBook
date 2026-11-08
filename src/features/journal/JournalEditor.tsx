import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatLongDate } from '../../lib/date';
import type { JournalEntry, JournalEntryChanges } from './useJournal';

interface JournalEditorProps {
  entry: JournalEntry;
  onChange: (changes: JournalEntryChanges) => void;
  onDelete: () => void;
  onBack: () => void;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

export function JournalEditor({ entry, onChange, onDelete, onBack }: JournalEditorProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const words = countWords(entry.body);

  return (
    <article className="animate-view-in border-line bg-card flex h-full flex-col rounded-2xl border p-5 shadow-sm md:p-8">
      <div className="text-ink-soft flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to entries"
          className="hover:text-ink -ml-1 rounded-md p-1 transition-colors md:hidden"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <time dateTime={entry.createdAt} className="truncate">
          {formatLongDate(entry.createdAt)}
        </time>
        <span className="ml-auto shrink-0">
          {words} {words === 1 ? 'word' : 'words'}
        </span>
        <button
          type="button"
          onClick={() => (confirmingDelete ? onDelete() : setConfirmingDelete(true))}
          onBlur={() => setConfirmingDelete(false)}
          aria-label={confirmingDelete ? 'Confirm delete entry' : 'Delete entry'}
          className={`flex shrink-0 items-center gap-1 rounded-md p-1 transition-colors ${
            confirmingDelete ? 'text-accent font-medium' : 'hover:text-accent'
          }`}
        >
          <Trash2 className="size-4" aria-hidden />
          {confirmingDelete && 'Delete?'}
        </button>
      </div>

      <input
        value={entry.title}
        onChange={(event) => onChange({ title: event.target.value })}
        placeholder="Give today a title"
        aria-label="Entry title"
        autoFocus={entry.title === '' && entry.body === ''}
        className="writing-field placeholder:text-ink-soft/60 mt-4 w-full bg-transparent font-serif text-2xl tracking-tight md:text-3xl"
      />
      <textarea
        value={entry.body}
        onChange={(event) => onChange({ body: event.target.value })}
        placeholder="What's on your mind?"
        aria-label="Entry text"
        className="writing-field placeholder:text-ink-soft/60 mt-3 min-h-0 w-full flex-1 resize-none bg-transparent leading-relaxed"
      />
    </article>
  );
}
