import { Check, ChevronDown, Maximize2, Minimize2, Smile, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EntryDateField } from './EntryDateField';
import { EntryPanel } from './EntryPanel';
import { MoodPicker } from './MoodPicker';
import { findMood } from './moods';
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

export function JournalEditor({
  entry,
  tagSuggestions,
  saveFailed,
  onChange,
  onDone,
  onDelete,
  onBack,
}: JournalEditorProps) {
  const [focusMode, setFocusMode] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const words = countWords(entry.body);
  const wordCount = `${words} ${words === 1 ? 'word' : 'words'}`;
  const mood = findMood(entry.mood);

  useEffect(() => {
    if (!focusMode) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setFocusMode(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusMode]);

  function toggleFocusMode() {
    setFocusMode((value) => !value);
    bodyRef.current?.focus();
  }

  const focusLabel = focusMode ? 'Exit focus mode' : 'Enter focus mode';

  return (
    <EntryPanel
      onBack={onBack}
      onDelete={onDelete}
      focusMode={focusMode}
      status={
        saveFailed ? (
          <span role="alert" className="text-accent flex items-center gap-1 font-medium">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            Couldn't save
          </span>
        ) : (
          <span className="flex items-center gap-1 pl-1">
            <Check className="size-4 shrink-0" aria-hidden />
            Saved
            {focusMode && <span className="pl-2 tabular-nums">{wordCount}</span>}
          </span>
        )
      }
      tools={
        <button type="button" onClick={toggleFocusMode} aria-label={focusLabel} title={focusLabel} className="icon-btn">
          {focusMode ? <Minimize2 className="size-4" aria-hidden /> : <Maximize2 className="size-4" aria-hidden />}
        </button>
      }
      action={
        <button type="button" onClick={onDone} className="btn btn-primary">
          Done
        </button>
      }
    >
      <input
        value={entry.title}
        onChange={(event) => onChange({ title: event.target.value })}
        placeholder="Give today a title"
        aria-label="Entry title"
        autoFocus={isBlank(entry)}
        className="writing-field placeholder:text-ink-soft/50 w-full bg-transparent font-serif text-3xl tracking-tight md:text-4xl"
      />

      {!focusMode && (
        <>
          <div className="text-ink-soft mt-4 flex flex-wrap items-center gap-2 text-sm">
            <EntryDateField value={entry.date} onChange={(date) => onChange({ date })} />
            <button
              type="button"
              onClick={() => setMoodOpen((open) => !open)}
              aria-expanded={moodOpen}
              className={`chip flex items-center gap-1.5 ${mood ? 'chip-on' : ''}`}
            >
              {mood ? (
                <span aria-hidden className="leading-none">
                  {mood.emoji}
                </span>
              ) : (
                <Smile className="size-4" aria-hidden />
              )}
              {mood ? `Mood: ${mood.label}` : 'Add mood'}
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${moodOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
            <span className="ml-auto shrink-0 tabular-nums">{wordCount}</span>
          </div>

          {moodOpen && (
            <div className="animate-item-in mt-3">
              <MoodPicker
                selected={entry.mood ? [entry.mood] : []}
                onToggle={(selected) => {
                  onChange({ mood: selected === entry.mood ? null : selected });
                  setMoodOpen(false);
                }}
              />
            </div>
          )}
        </>
      )}

      <div
        data-value={entry.body}
        className={`autogrow mt-6 font-serif leading-[1.85] ${
          focusMode ? 'min-h-[60vh] text-xl' : 'min-h-[38vh] text-[1.0625rem]'
        }`}
      >
        <textarea
          ref={bodyRef}
          value={entry.body}
          onChange={(event) => onChange({ body: event.target.value })}
          placeholder="What's on your mind?"
          aria-label="Entry text"
          className="writing-field placeholder:text-ink-soft/50 w-full bg-transparent"
        />
      </div>

      {!focusMode && (
        <div className="border-line mt-6 border-t pt-5">
          <span className="section-label">Tags (optional)</span>
          <TagInput tags={entry.tags} suggestions={tagSuggestions} onChange={(tags) => onChange({ tags })} />
        </div>
      )}
    </EntryPanel>
  );
}
