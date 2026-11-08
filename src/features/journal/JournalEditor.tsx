import { Check, TriangleAlert } from 'lucide-react';
import { EntryDateField } from './EntryDateField';
import { EntryPanel, PRIMARY_ACTION_CLASS } from './EntryPanel';
import { MoodPicker } from './MoodPicker';
import { TagInput } from './TagInput';
import { isBlank, type JournalEntry, type JournalEntryChanges } from './useJournal';

interface JournalEditorProps {
  entry: JournalEntry;
  tagSuggestions: string[];
  saveFailed: boolean;
  onChange: (changes: JournalEntryChanges) => void;
  onDone: () => void;
  onDelete: () => void;
  onBack: () => void;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

const SECTION_LABEL_CLASS = 'text-ink-soft mb-2 block text-sm';

export function JournalEditor({
  entry,
  tagSuggestions,
  saveFailed,
  onChange,
  onDone,
  onDelete,
  onBack,
}: JournalEditorProps) {
  const words = countWords(entry.body);

  return (
    <EntryPanel
      onBack={onBack}
      onDelete={onDelete}
      status={
        saveFailed ? (
          <span role="alert" className="text-accent flex items-center gap-1 font-medium">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            Couldn't save
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Check className="size-4 shrink-0" aria-hidden />
            Saved
          </span>
        )
      }
      action={
        <button type="button" onClick={onDone} className={PRIMARY_ACTION_CLASS}>
          Done
        </button>
      }
    >
      <div className="text-ink-soft flex items-center justify-between gap-3 text-sm">
        <EntryDateField value={entry.date} onChange={(date) => onChange({ date })} />
        <span className="shrink-0 tabular-nums">
          {words} {words === 1 ? 'word' : 'words'}
        </span>
      </div>

      <input
        value={entry.title}
        onChange={(event) => onChange({ title: event.target.value })}
        placeholder="Give today a title"
        aria-label="Entry title"
        autoFocus={isBlank(entry)}
        className="writing-field placeholder:text-ink-soft/60 mt-5 w-full bg-transparent font-serif text-2xl tracking-tight md:text-3xl"
      />

      <div className="mt-5">
        <span className={SECTION_LABEL_CLASS}>How are you feeling?</span>
        <MoodPicker
          selected={entry.mood ? [entry.mood] : []}
          onToggle={(mood) => onChange({ mood: mood === entry.mood ? null : mood })}
        />
      </div>

      <div
        data-value={entry.body}
        className="autogrow border-line mt-5 min-h-64 border-t pt-5 font-serif text-[1.0625rem] leading-8"
      >
        <textarea
          value={entry.body}
          onChange={(event) => onChange({ body: event.target.value })}
          placeholder="What's on your mind?"
          aria-label="Entry text"
          className="writing-field placeholder:text-ink-soft/60 w-full bg-transparent"
        />
      </div>

      <div className="mt-5">
        <span className={SECTION_LABEL_CLASS}>Tags (optional)</span>
        <TagInput
          tags={entry.tags}
          suggestions={tagSuggestions}
          onChange={(tags) => onChange({ tags })}
        />
      </div>
    </EntryPanel>
  );
}
