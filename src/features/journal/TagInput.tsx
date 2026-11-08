import { X } from 'lucide-react';
import { useState, type ChangeEvent, type KeyboardEvent } from 'react';

const MAX_TAG_LENGTH = 30;
const MAX_SUGGESTIONS = 8;

function normalizeTag(raw: string): string {
  return raw.trim().replace(/^#+/, '').replace(/\s+/g, '-').toLowerCase().slice(0, MAX_TAG_LENGTH);
}

interface TagInputProps {
  tags: string[];
  /** Tags already used elsewhere in the journal. */
  suggestions: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, suggestions, onChange }: TagInputProps) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const typed = normalizeTag(text);
  const matches = suggestions
    .filter((tag) => !tags.includes(tag) && tag.includes(typed))
    .slice(0, MAX_SUGGESTIONS);

  function addTags(rawTags: string[]) {
    const next = [...tags];
    for (const raw of rawTags) {
      const tag = normalizeTag(raw);
      if (tag && !next.includes(tag)) next.push(tag);
    }
    if (next.length !== tags.length) onChange(next);
    setText('');
  }

  // Commas are read here, not in onKeyDown, because many phone keyboards don't report which key was pressed.
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const parts = event.target.value.split(',');
    const unfinished = parts.pop() ?? '';
    if (parts.length > 0) addTags(parts);
    setText(unfinished);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTags([text]);
    } else if (event.key === 'Backspace' && text === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div>
      <div className="field flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="animate-item-in bg-accent-soft text-accent flex max-w-full items-center gap-0.5 rounded-md py-0.5 pr-1 pl-2 text-sm"
          >
            <span className="truncate">#{tag}</span>
            <button
              type="button"
              onClick={() => onChange(tags.filter((other) => other !== tag))}
              aria-label={`Remove tag ${tag}`}
              className="hover:bg-accent/15 rounded p-0.5 transition-colors"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </span>
        ))}
        <input
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (text.trim()) addTags([text]);
          }}
          placeholder={tags.length === 0 ? 'Add tags, separated by commas' : 'Add another'}
          aria-label="Add tag"
          enterKeyHint="done"
          className="writing-field placeholder:text-ink-soft/70 min-w-32 flex-1 bg-transparent py-0.5 text-base sm:text-sm"
        />
      </div>
      {focused && matches.length > 0 && (
        <div className="animate-item-in mt-2 flex flex-wrap gap-1.5">
          {matches.map((tag) => (
            <button
              key={tag}
              type="button"
              // Keeps focus in the input so its blur handler doesn't run first.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => addTags([tag])}
              className="chip"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
