import { Check, Pencil, X } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';
import type { Todo } from './useTodos';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onRename: (text: string) => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onRename, onDelete }: TodoItemProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  // Escape unmounts the input, and the blur that follows must not save it.
  const cancelled = useRef(false);

  function startEditing() {
    cancelled.current = false;
    setDraft(todo.text);
  }

  function commit() {
    if (cancelled.current || draft === null) return;
    const text = draft.trim();
    if (text && text !== todo.text) onRename(text);
    setDraft(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') commit();
    if (event.key === 'Escape') {
      cancelled.current = true;
      setDraft(null);
    }
  }

  return (
    <li
      onAnimationEnd={(event) => {
        if (event.animationName === 'item-out') onDelete();
      }}
      className={`${leaving ? 'animate-item-out' : 'animate-item-in'} group border-line bg-card flex items-center gap-3 rounded-xl border px-3 py-2.5 shadow-sm`}
    >
      <label className="relative grid size-6 shrink-0 cursor-pointer place-items-center">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={onToggle}
          aria-label={`Mark "${todo.text}" as ${todo.done ? 'not done' : 'done'}`}
          className="peer sr-only"
        />
        <span className="border-ink-soft/40 peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-accent size-5 rounded-full border-[1.5px] transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2" />
        <Check
          aria-hidden
          strokeWidth={3}
          className={`text-paper absolute size-3 transition-transform duration-200 ease-out ${
            todo.done ? 'scale-100' : 'scale-0'
          }`}
        />
      </label>

      {draft === null ? (
        <span
          onDoubleClick={startEditing}
          className={`min-w-0 flex-1 wrap-break-word transition-colors duration-200 ${
            todo.done ? 'text-ink-soft line-through' : ''
          }`}
        >
          {todo.text}
        </span>
      ) : (
        <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          aria-label="Edit task"
          className="writing-field min-w-0 flex-1 bg-transparent"
        />
      )}

      {/* Always visible on touch screens, which have no hover. */}
      <div className="flex shrink-0 gap-0.5 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100 pointer-fine:opacity-0">
        <button
          type="button"
          onClick={startEditing}
          aria-label={`Edit "${todo.text}"`}
          className="text-ink-soft hover:text-ink rounded-md p-1 transition-colors"
        >
          <Pencil className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setLeaving(true)}
          aria-label={`Delete "${todo.text}"`}
          className="text-ink-soft hover:text-accent rounded-md p-1 transition-colors"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}
