import { useState } from 'react';

interface EntryDateFieldProps {
  value: string;
  onChange: (date: string) => void;
}

/** A date input that can be mid-edit without ever saving an entry with no date. */
export function EntryDateField({ value, onChange }: EntryDateFieldProps) {
  const [draft, setDraft] = useState(value);

  return (
    <input
      type="date"
      value={draft}
      onChange={(event) => {
        setDraft(event.target.value);
        if (event.target.value) onChange(event.target.value);
      }}
      onBlur={() => setDraft(value)}
      aria-label="Entry date"
      className="field text-ink-soft min-w-0 py-1 text-sm"
    />
  );
}
