import { Plus } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import { TodoFields } from './TodoFields';
import { DEFAULT_PRIORITY } from './priorities';
import type { TodoDraft } from './useTodos';

interface TodoComposerProps {
  inputRef: RefObject<HTMLInputElement | null>;
  /** The due date a new task starts with, so it lands in the view being looked at. */
  presetDueDate: string | null;
  onAdd: (draft: TodoDraft) => void;
}

function blankDraft(dueDate: string | null): TodoDraft {
  return { title: '', description: '', dueDate, priority: DEFAULT_PRIORITY };
}

export function TodoComposer({ inputRef, presetDueDate, onAdd }: TodoComposerProps) {
  const [draft, setDraft] = useState(() => blankDraft(presetDueDate));
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const title = draft.title.trim();
  const isPristine = title === '' && draft.description.trim() === '';

  useEffect(() => {
    if (isPristine) setDraft((current) => ({ ...current, dueDate: presetDueDate }));
    // Depends on the preset alone: a change of view should reset the date, typing should not.
  }, [presetDueDate]);

  // A click outside folds away an untouched form. Anything typed keeps it open.
  useEffect(() => {
    if (!open || !isPristine) return;
    function onPointerDown(event: PointerEvent) {
      if (!formRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, isPristine]);

  function change(changes: Partial<TodoDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  function reset() {
    setDraft(blankDraft(presetDueDate));
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title) return;
    onAdd({ ...draft, title, description: draft.description.trim() });
    setDraft(blankDraft(presetDueDate));
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Escape') reset();
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) event.currentTarget.requestSubmit();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className={`panel transition duration-200 ${open ? 'border-accent/50 shadow-lifted' : 'hover:border-ink-soft/40'}`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <Plus className={`size-5 shrink-0 transition-colors duration-200 ${open ? 'text-accent' : 'text-ink-soft'}`} aria-hidden />
        <input
          ref={inputRef}
          value={draft.title}
          onChange={(event) => change({ title: event.target.value })}
          onFocus={() => setOpen(true)}
          placeholder="Add a task"
          aria-label="New task"
          enterKeyHint="done"
          className="writing-field placeholder:text-ink-soft/70 min-w-0 flex-1 bg-transparent text-base"
        />
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div inert={!open} className="min-h-0 overflow-hidden">
          <div className="px-4 pb-3">
            <TodoFields draft={draft} onChange={change} />
            <div className="mt-3 flex justify-end gap-1">
              <button type="button" onClick={reset} className="btn btn-quiet">
                Cancel
              </button>
              <button type="submit" disabled={!title} className="btn btn-primary">
                Add task
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
