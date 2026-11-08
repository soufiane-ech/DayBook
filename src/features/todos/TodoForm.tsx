import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';

export function TodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('');
  const trimmed = text.trim();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-line bg-card focus-within:border-accent/60 mt-5 flex items-center gap-2 rounded-xl border p-1.5 pl-4 shadow-sm transition-colors duration-200"
    >
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add a task"
        aria-label="New task"
        className="writing-field placeholder:text-ink-soft/70 min-w-0 flex-1 bg-transparent py-1.5"
      />
      <button
        type="submit"
        disabled={!trimmed}
        aria-label="Add task"
        className="bg-ink text-paper grid size-9 shrink-0 place-items-center rounded-lg transition duration-200 disabled:cursor-default disabled:opacity-30"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </form>
  );
}
